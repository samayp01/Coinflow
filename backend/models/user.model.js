const { getCurrentCycle, isValidCycle, dateToCycle } = require('../utils/cycle');
const Expense = require('./expense.model');
const Budget = require('./budget.model');

class User {
  constructor(id, jwt) {
    this.validate(id, jwt);
    
    this.id = id;                      // string
    this.jwt = jwt;                    // string
    this.meta = { lastLogin: '' };     // object
    this.cycles = { };                 // object
  }

  static fromJson(json) {
    const user = new User(json.id, json.jwt);
    user.meta = json.meta;
    user.cycles = json.cycles;
    return user;
  }

  validate(id, jwt) {
    if (typeof id !== 'string') {
      throw new Error('User id must be a string.');
    }

    if (typeof jwt !== 'string') {
      throw new Error('User jwt must be a string.');
    }
  }

  stringify() {
    return JSON.stringify(this);
  }

  updateLastLogin() {
    this.meta.lastLogin = new Date().toISOString();
  }

  getLastLogin() {
    return this.meta.lastLogin;
  }

  isLoggedIn() {
    return getJwt() !== '';
  }

  deleteJwt() {
    this.jwt = '';
  }

  getJwt() {
    return this.jwt;
  }

  setJwt(jwt) {
    if (!jwt || typeof jwt !== 'string') {
      throw new Error('User jwt must be a string.');
    }

    this.jwt = jwt;
  }

  getCycles() {
    return this.cycles;
  }

  getCycle(cycle) {
    this.validateCycle(cycle);
    return this.cycles[cycle];
  }

  getExpense(cycle, expenseId) {
    this.validateCycle(cycle);
    this.validateExpenseId(expenseId);

    return this.cycles[cycle].expenses.find(e => e.id === expenseId);
  }

  getExpenses(cycle) {
    try {
      this.validateCycle(cycle);
    } catch (err) {
      return [];
    }

    if(!this.cycles[cycle] || !this.cycles[cycle].expenses) {
      return [];
    } else {
      return this.cycles[cycle].expenses;
    }
  }

  addExpense(expense) {
    const currentCycle = getCurrentCycle();
    if (!expense || !(expense instanceof Expense)) {
      throw new Error('Invalid expense.');
    }

    if (dateToCycle(expense.date) !== currentCycle) {
      throw new Error(`Expense date does not match current cycle <${getCurrentCycle()}>.`);
    }

    const cycleEntry = this.cycles[currentCycle];
    if (!cycleEntry) {
      this.cycles[currentCycle] = {};
    } else if (cycleEntry.expenses && cycleEntry.expenses.some(e => e.id === expense.id)) {
      throw new Error(`Expense with id ${expense.id} already exists.`);
    }

    if (!this.cycles[currentCycle].expenses) {
      this.cycles[currentCycle].expenses = [];
    }

    this.cycles[currentCycle].expenses.push(expense);
  }

  updateExpense(expense) {
    const currentCycle = getCurrentCycle();
    if (!expense || !(expense instanceof Expense) || !this.getExpense(currentCycle, expense.id)) {
      throw new Error('Invalid expense.');
    }

    for (let i = 0; i < this.cycles[currentCycle].expenses.length; i++) {
      if (this.cycles[currentCycle].expenses[i].id === expense.id) {
        this.cycles[currentCycle].expenses[i] = expense;
        return;
      }
    }
    
    throw new Error(`Expense with id ${expense.id} does not exist.`);
  }

  deleteExpense(expenseId) {
    const currentCycle = getCurrentCycle();
    this.validateExpenseId(expenseId);

    this.cycles[currentCycle].expenses = this.cycles[currentCycle].expenses.filter(e => e.id != expenseId);
  }

  getBudget(cycle) {
    this.validateCycle(cycle);
    return this.cycles[cycle].budget;
  }

  addBudget(budget) {
    const currentCycle = getCurrentCycle();
    if (!budget || !(budget instanceof Budget)) {
      throw new Error('Invalid budget.');
    }

    const cycleEntry = this.cycles[currentCycle];
    if (cycleEntry && cycleEntry.budget) {
      throw new Error(`Budget already exists.`);
    }
    
    this.cycles[currentCycle] = { budget: budget };
  }

  updateBudget(budget) {
    const currentCycle = getCurrentCycle();
    if (!budget || !(budget instanceof Budget) || !this.getBudget(currentCycle)) {
      throw new Error('Invalid budget.');
    }

    this.cycles[currentCycle].budget = budget;
  }

  deleteBudget() {
    const currentCycle = getCurrentCycle();
    if (this.getBudget(currentCycle)) {
      delete this.cycles[currentCycle].budget;
    }
  }

  validateCycle(cycle) {
    if (!isValidCycle(cycle)) {
      throw new Error('Invalid cycle.');
    }

    if (!this.cycles[cycle]) {
      return [];
    }
  }

  validateExpenseId(expenseId) {
    const currentCycle = getCurrentCycle();
    if (!expenseId || isNaN(expenseId)) {
      throw new Error('Invalid expense id.');
    }

    if (!this.cycles[currentCycle] || !this.cycles[currentCycle].expenses) {
      throw new Error(`Expense with id ${expenseId} does not exist.`);
    }

    for (let i = 0; i < this.cycles[currentCycle].expenses.length; i++) {
      if (this.cycles[currentCycle].expenses[i].id == expenseId) {
        return;
      }
    }

    throw new Error(`Expense with id ${expenseId} does not exist.`);
  }
}

module.exports = User;