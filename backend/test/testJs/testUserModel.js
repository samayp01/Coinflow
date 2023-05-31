const User = require('../../models/user.model');
const Expense = require('../../models/expense.model');
const Budget = require('../../models/budget.model');
const { getCurrentCycle } = require('../../utils/cycle');

test();

function test() {
  let validationFailed = false;
  let user1;

  try {
    user1 = new User(123, 456);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ User Model Test failed: constructor validation failed.');
    process.exit(1);
  }

  try {
    user1 = new User('username', 'jwttoken');
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (user1.id !== 'username' || user1.getJwt() !== 'jwttoken') {
    console.log('❌ User Model Test failed: getter/setter failed.');
    process.exit(1);
  }

  const user1String = user1.stringify();
  const user1Obj = JSON.parse(user1String);

  if (user1Obj.id !== 'username' || user1Obj.jwt !== 'jwttoken') {
    console.log('❌ User Model Test failed: stringify failed.');
    process.exit(1);
  }

  const now = new Date();
  user1.updateLastLogin();
  if (user1.lastLogin < now) {
    console.log('❌ User Model Test failed: updateLastLogin failed.');
    process.exit(1);
  }

  user1.deleteJwt();
  if (user1.getJwt() !== '') {
    console.log('❌ User Model Test failed: deleteJwt failed.');
    process.exit(1);
  }

  user1.setJwt('newjwttoken');
  if (user1.getJwt() !== 'newjwttoken') {
    console.log('❌ User Model Test failed: setJwt failed.');
    process.exit(1);
  }
  
  const expenseList = [
    new Expense(1, 'Walmart', 100, now),
    new Expense(2, 'Target', 200, now),
    new Expense(3, 'Costco', 300, now),
    new Expense(4, 'Amazon', 400, now)
  ];

  for (const exp of expenseList) {
    try {
      user1.addExpense(exp);
    } catch(err) {
      console.log('❌ User Model Test failed: ' + err.message);
      process.exit(1);
    }    
  }

  const currentCycle = getCurrentCycle();

  for (const exp of expenseList) {
    let expObj;
    try {
      expObj = user1.getExpense(currentCycle, exp.id);
    } catch(err) {
      console.log('❌ User Model Test failed: ' + err.message);
      process.exit(1);
    }

    if (expObj.id !== exp.id || expObj.merchant !== exp.merchant || expObj.amount !== exp.amount || expObj.date !== exp.date) {
      console.log('❌ User Model Test failed: addExpense failed.');
      process.exit(1);
    }
  }

  let expenseListFromUser;
  try {
    expenseListFromUser = user1.getExpenses(currentCycle);
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (expenseListFromUser.length !== expenseList.length) {
    console.log('❌ User Model Test failed: getExpenses failed.');
    process.exit(1);
  }

  try {
    const newExp = new Expense(1, 'New Merchant', 100, now);
    user1.updateExpense(newExp);

    if(user1.getExpense(currentCycle, 1).merchant !== 'New Merchant') {
      throw new Error('updateExpense failed.');
    }
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  try {
    user1.deleteExpense(1);
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  validationFailed = false;
  try {
    const exp = user1.getExpense(currentCycle, 1);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ User Model Test failed: deleteExpense failed.');
    process.exit(1);
  }

  if (user1.getExpenses(currentCycle).length !== expenseList.length - 1) {
    console.log('❌ User Model Test failed: deleteExpense failed.');
    process.exit(1);
  }



  const readBudget = user1.getBudget(currentCycle);
  if (readBudget) {
    console.log('❌ User Model Test failed: getBudget failed.');
    process.exit(1);
  }

  const budget1 = new Budget(200, 175);
  try {
    user1.addBudget(budget1);
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  const budgetFromUser = user1.getBudget(currentCycle);
  if (budgetFromUser.amount !== budget1.amount || budgetFromUser.limit !== budget1.limit) {
    console.log('❌ User Model Test failed: addBudget failed.');
    process.exit(1);
  }

  const budget2 = new Budget(300, 250);
  try {
    user1.updateBudget(budget2);
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  const updatedBudgetFromUser = user1.getBudget(currentCycle);
  if (updatedBudgetFromUser.amount !== budget2.amount || updatedBudgetFromUser.limit !== budget2.limit) {
    console.log('❌ User Model Test failed: updateBudget failed.');
    process.exit(1);
  }

  try {
    user1.deleteBudget();
  } catch(err) {
    console.log('❌ User Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (user1.getBudget(currentCycle)) {
    console.log('❌ User Model Test failed: deleteBudget failed.');
    process.exit(1);
  }

  console.log('✅ User module tests passed.');
}