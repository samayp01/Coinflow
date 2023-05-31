class Expense {
  constructor(id, merchant, amount, date) {
    this.validate(id, merchant, amount, date);

    this.id = id;
    this.merchant = merchant;
    this.amount = amount;
    this.date = date;
  }

  validate(id, merchant, amount, date) {
    if (id === undefined || isNaN(id)) {
      throw new Error('Invalid expense id.');
    }

    if (!amount || isNaN(amount) || amount < 0) {
      throw new Error('Invalid expense amount.');
    }

    if (!date || date > new Date()) {
      throw new Error('Invalid expense date.');
    }

    if (!merchant || merchant.length === 0) {
      throw new Error('Invalid expense merchant.');
    }
  }

  stringify() {
    return JSON.stringify(this);
  }
}

module.exports = Expense;