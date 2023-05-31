const Expense = require('../../models/expense.model');

test();

function test() {
  let exp1;
  let now = new Date();
  try {
    exp1 = new Expense(1, 'Walmart', 100, now);
  } catch(err) {
    console.log('❌ Expense Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (exp1.id !== 1 || exp1.merchant !== 'Walmart' || exp1.amount !== 100 || exp1.date !== now) {
    console.log('❌ Expense Model Test failed: id getter/setter failed.');
    process.exit(1);
  }

  let validationFailed = false;
  
  try {
    exp1 = new Expense('stringId', 'Walmart', 100, now);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Expense Model Test failed: id validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    exp1 = new Expense(1, '', 100, now);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Expense Model Test failed: merchant validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    exp1 = new Expense(1, 'Walmart', 'stringAmount', now);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Expense Model Test failed: amount validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    exp1 = new Expense(1, 'Walmart', -2, now);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Expense Model Test failed: amount validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  now.setHours(now.getHours() + 1);
  try {
    exp1 = new Expense(1, 'Walmart', 100, now);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Expense Model Test failed: date validation failed.');
    process.exit(1);
  }

  console.log('✅ Expense module tests passed.');  
}