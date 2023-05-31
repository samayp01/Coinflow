/**
 * Cycle (month-year) date-parsing module
 */

const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

function getCurrentCycle() {
  return dateToCycle(new Date());
}

function isValidCycle(cycle) {
  if (!cycle || typeof cycle !== 'string' || cycle.length !== 7) {
    return false;
  }

  const month = cycle.substring(0, 3).toLowerCase();
  const year = cycle.substring(3, 7);

  return months.includes(month) && !isNaN(year) && 
    year.length === 4 && year <= (new Date()).getFullYear();
}

function dateToCycle(rawDate) {
  const date = new Date(rawDate);
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  return `${month}${year}`;
}


module.exports = {
  getCurrentCycle,
  isValidCycle,
  dateToCycle
};