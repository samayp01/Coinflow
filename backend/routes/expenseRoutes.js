const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/user.model');
const Expense = require('../models/expense.model');
const { isValidCycle } = require('../utils/cycle');
const { decodeToken } = require('../utils/auth');
const Email = require('../utils/email');
const db = require('../utils/init/initDb');

const authorize = require('./middleware/authorize');

const AUTH_API_SECRET = process.env.AUTH_API_SECRET;


router.get('/', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  let userObj;
  try {
    userObj = await getUserByToken(token);
  } catch (err) {
    return res.status(401).send('Invalid token. ' + err.message);
  }

  if (req.query.cycle) {
    const cycle = req.query.cycle;
    if (!isValidCycle(cycle)) {
      return res.status(400).send('Invalid cycle');
    }

    try {
      if (req.query.id) {
        const expense = userObj.getExpense(cycle, req.query.id);
        return res.status(200).json(expense);
      } else {
        const expenses = userObj.getExpenses(cycle);
        return res.status(200).json(expenses);
      }
    } catch (err) {
      return res.status(400).send('Invalid query');
    }
  } else {
    return res.status(400).send('Missing cycle query');
  }
});


router.post('/', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  let userObj;
  try {
    userObj = await getUserByToken(token);
  } catch (err) {
    return res.status(401).send('Invalid token. ' + err.message);
  }

  try {
    const { id, merchant, amount, date } = req.body;
    const newExpense = new Expense(id, merchant, amount, date);
    userObj.addExpense(newExpense);
  } catch (err) {
    return res.status(400).send('Invalid request body. ' + err.message);
  }

  try {
    db.updateItem(userObj.id, userObj);
  } catch (err) {
    return res.status(500).send('Server error, unable to add expense');
  }

  return res.status(200).send(userObj);
});


router.put('/', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  let userObj;
  try {
    userObj = await getUserByToken(token);
  } catch (err) {
    return res.status(401).send('Invalid token. ' + err.message);
  }

  try {
    const { id, merchant, amount, date } = req.body;
    const newExpense = new Expense(id, merchant, amount, date);
    userObj.updateExpense(newExpense);
  } catch (err) {
    return res.status(400).send('Invalid request body. ' + err.message);
  }

  try {
    db.updateItem(userObj.id, userObj);
  } catch (err) {
    return res.status(500).send('Server error, unable to add expense');
  }

  return res.status(200).send(userObj);
});


router.delete('/', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  let userObj;
  try {
    userObj = await getUserByToken(token);
  } catch (err) {
    return res.status(401).send('Invalid token. ' + err.message);
  }

  try {
    const id = req.query.id;
    if (!id || isNaN(id)) {
      throw new Error('Invalid id');
    }
    userObj.deleteExpense(id);
  } catch (err) {
    return res.status(400).send('Invalid request body. ' + err.message);
  }

  try {
    db.updateItem(userObj.id, userObj);
  } catch (err) {
    return res.status(500).send('Server error, unable to add expense');
  }

  return res.status(200).send(userObj);
});


async function getUserByToken(token) {
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decodedToken = decodeToken(token, AUTH_API_SECRET);
  const emailAddress = decodedToken.data.id;
  if (!Email.isValidAddress(emailAddress)) {
    throw new Error('Invalid token');
  }

  const userData = await db.readItem(emailAddress);
  if (!userData) {
    throw new Error('User not found');
  }

  const userObj = User.fromJson(userData);
  
  if (userObj.jwt != token) {
    throw new Error('Invalid token');
  }

  return userObj;
}


module.exports = router;