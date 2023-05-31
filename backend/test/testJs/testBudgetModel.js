const Budget = require('../../models/budget.model');

test();

function test() {
  let budget1;
  try {
    budget1 = new Budget(100, 99);
  } catch(err) {
    console.log('❌ Budget Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (budget1.limit !== 100 || budget1.warnLimit !== 99) {
    console.log('❌ Budget Model Test failed: limit getter/setter failed.');
    process.exit(1);
  }

  try {
    budget1 = new Budget(100, 100);
  } catch(err) {
    console.log('❌ Budget Model Test failed: ' + err.message);
    process.exit(1);
  }

  if (budget1.limit !== 100 || budget1.warnLimit !== 100) {
    console.log('❌ Budget Model Test failed: limit getter/setter failed.');
    process.exit(1);
  }

  try {
    budget1 = new Budget(100, 100);
  } catch(err) {
    console.log('❌ Budget Model Test failed: limit validation failed.');
    process.exit(1);
  }

  let validationFailed = false;

  try {
    budget1 = new Budget('stringLimit', 100);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Budget Model Test failed: limit validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    budget1 = new Budget(100, 'stringWarnLimit');
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Budget Model Test failed: warnLimit validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    budget1 = new Budget(100, -2);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Budget Model Test failed: warnLimit validation failed.');
    process.exit(1);
  }

  validationFailed = false;
  try {
    budget1 = new Budget(-5, -10);
  } catch(err) {
    validationFailed = true;
  }

  if (!validationFailed) {
    console.log('❌ Budget Model Test failed: limit validation failed.');
    process.exit(1);
  }

  console.log('✅ Budget module tests passed.');
}



