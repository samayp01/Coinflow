class Budget {
  constructor(limit, warnLimit) {
    this.validate(limit, warnLimit);

    this.limit = limit;
    this.warnLimit = warnLimit;
  }

  validate(limit, warnLimit) {
    if (!limit || isNaN(limit) || limit < 0) {
      throw new Error('Invalid budget limit.');
    }

    if (!warnLimit || isNaN(warnLimit) || warnLimit < 0) {
      throw new Error('Invalid budget warn limit.');
    }

    if (warnLimit > limit) {
      throw new Error('Budget warning limit cannot be greater than budget limit.');
    }
  }

  stringify() {
    return JSON.stringify(this);
  }
}

module.exports = Budget;