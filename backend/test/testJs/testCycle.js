const { getCurrentCycle, isValidCycle, dateToCycle } = require('../../utils/cycle');

test();

async function test() {
  const year = new Date().getFullYear();
  const month = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const expectedCycle = `${month}${year}`;
  const currentCycle = getCurrentCycle();

  if (expectedCycle !== currentCycle) {
    console.log(`❌ Cycle Test failed: Expected <${expectedCycle}> but got <${currentCycle}>`);
    process.exit(1);
  }

  const validCycles = [
    'jan2020', 'feb2022', 'mar2022', 'apr2023', 'may2020', 'jun2019',
    'jul2023', 'aug2023', 'sep2023', 'oct2023', 'nov2023', 'dec2023',
  ];

  const invalidCycles = [
    'jan', 'january', 'abc1234', '1234567', `jan${year + 1}`
  ];

  for (let cycle of validCycles) {
    if (!isValidCycle(cycle)) {
      console.log(`❌ Cycle Test failed: Expected <${cycle}> to be valid but it was invalid`);
      process.exit(1);
    }
  }

  for (let cycle of invalidCycles) {
    if (isValidCycle(cycle)) {
      console.log(`❌ Cycle Test failed: Expected <${cycle}> to be invalid but it was valid`);
      process.exit(1);
    }
  }

  // generate a list of random dates
  const dates = [
    { date: new Date('2020-01-31'), cycle: 'jan2020' },
    { date: new Date('2022-02-15'), cycle: 'feb2022' },
    { date: new Date('2018-11-08'), cycle: 'nov2018' },
    { date: new Date('2023-04-27'), cycle: 'apr2023' },
  ];

  for (let { date, cycle } of dates) {
    const result = dateToCycle(date);
    if (result !== cycle) {
      console.log(`❌ Cycle Test failed: Expected <${cycle}> but got <${result}>`);
      process.exit(1);
    }
  }

  console.log('✅ Cycle module tests passed');
}