const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { constructToken, decodeToken, generateVerificationCode } = require('../utils/auth');
const User = require('../models/user.model');
const Email = require('../utils/email');
const cache = require('../utils/init/initCache');
const db = require('../utils/init/initDb');
const email = require('../utils/init/initEmail');
const authorize = require('./middleware/authorize');

const EMAIL_SENDER = process.env.AZURE_SENDER_EMAIL_ADDRESS;
const EMAIL_SUBJECT = 'Verify your email';
const EMAIL_BODY = 'Your verification code is: ';

const AUTH_API_SECRET = process.env.AUTH_API_SECRET;
const CODE_EXPIRATION = 600000;       // 10 minutes
const TOKEN_EXPIRATION = 1209600000;  // 14 days
const COOKIE_NAME = 'jwt';


router.post('/login', async (req, res) => {
  let recipientEmail;
  if (Email.isValidAddress(req.body.id)) {
    recipientEmail = req.body.id;
  } else {
    return res.status(400).send('Invalid id. Cannot be parsed as email address.');
  }

  const code = generateVerificationCode();
  email.send(EMAIL_SENDER, recipientEmail, EMAIL_SUBJECT, EMAIL_BODY + code);
  
  const expirationTime = new Date(new Date().getTime() + CODE_EXPIRATION);
  const verificationObject = { code: code, expires: expirationTime }

  await cache.set(recipientEmail, JSON.stringify(verificationObject));
  res.status(200).json({ expires: expirationTime });

  setTimeout(() => cache.del(recipientEmail), CODE_EXPIRATION);
});


router.post('/verify', async (req, res) => {
  let recipientEmail;
  if (Email.isValidAddress(req.body.id)) {
    recipientEmail = req.body.id;
  } else {
    return res.status(400).send('Invalid id. Cannot be parsed as email address.');
  }

  let code = req.body.code;
  if (!code || code.length != 6) {
    return res.status(400).send('Invalid code.');
  }

  const verificationObjectString = await cache.get(recipientEmail);
  if (!verificationObjectString) {
    return res.status(401).send('Code expired.');
  }

  const verificationObject = JSON.parse(verificationObjectString);
  const expirationTime = new Date(verificationObject.expires);
  const cachedCode = verificationObject.code;

  if (expirationTime < new Date()) {
    return res.status(401).send('Code expired.');
  }

  if (code != cachedCode) {
    return res.status(401).send('Invalid code.');
  }

  cache.del(recipientEmail);

  let user;

  try {
    const now = new Date();
    const token = constructToken({
        id: recipientEmail,
        lastLogin: now
      }, AUTH_API_SECRET);
    
    const userData = await db.readItem(recipientEmail);
    if (!userData) {
      user = new User(recipientEmail, token);
      user.updateLastLogin();
      db.createItem(user);
    } else {
      user = User.fromJson(userData);
      user.setJwt(token);
      user.updateLastLogin();
      db.updateItem(user.id, user);
    }

    res.cookie(COOKIE_NAME, token, { 
      httpOnly: true,
      maxAge: TOKEN_EXPIRATION,
      secure: true
    });

  } catch(err) {
    return res.status(500).send('Server error, unable to authenticate user');
  }

  res.status(200).json(user);
});


router.get('/logout', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token found');
  }

  const decodedToken = decodeToken(token, AUTH_API_SECRET);
  if (!decodedToken) {
    return res.status(401).send('Invalid token');
  }
  
  try {
    const userData = await db.readItem(decodedToken.data.id);
    if (!userData) {
      return res.status(400).send('User not found');
    } else {
      const user = User.fromJson(userData);
      user.deleteJwt();
      db.updateItem(user.id, user);
      res.clearCookie(COOKIE_NAME);
      return res.status(200).send('Successfully logged out');
    }
  } catch (err) {
    return res.status(500).send('Server error, unable to log user out');
  }
});


router.get('/token', authorize, async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token found');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token found');
  }

  const decodedToken = decodeToken(token, AUTH_API_SECRET);
  if (!decodedToken) {
    return res.status(401).send('Invalid token');
  }

  const userData = await db.readItem(decodedToken.data.id);
  if (!userData) {
    return res.status(400).send('User not found');
  }

  const user = User.fromJson(userData);
  if (user.jwt != token) {
    return res.status(401).send('Invalid token');
  }

  res.status(200).send('OK');
});


module.exports = router;