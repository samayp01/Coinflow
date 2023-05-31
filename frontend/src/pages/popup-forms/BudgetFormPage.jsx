import React, { useState, useEffect } from 'react';
import { addBudget, updateBudget } from '../../services/budgetService';
import '../../style/FormPopup.css';

function BudgetFormPage({ initialData, onClose }) {
  const [limit, setLimit] = useState(0);
  const [warnLimit, setWarnLimit] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setLimit(initialData.limit);
      setWarnLimit(initialData.warnLimit);
    } else {
      setLimit(0);
      setWarnLimit(0);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (limit < 0) {
      setError('Limit must be a non-negative number.');
      return;
    }

    if (warnLimit < 0) {
      setError('Warn limit must be a non-negative number.');
      return;
    }

    if (warnLimit > limit) {
      setError('Warn limit must be less than or equal to limit.');
      return;
    }

    const budget = {
      limit: limit,
      warnLimit: warnLimit,
    };

    let res;
    if (initialData) {
      res = await updateBudget(budget);
    } else {
      res = await addBudget(budget);
    }

    if (res) {
      setError('');
      onClose();
    } else {
      setError('Failed to submit form.');
    }
  };

  const handleLimitChange = (e) => {
    try {
      setLimit(parseInt(e.target.value, 10));
    } catch (err) {
      // do nothing
    }
  };

  const handleWarnLimitChange = (e) => {
    try {
      setWarnLimit(parseInt(e.target.value, 10));
    } catch (err) {
      // do nothing
    }
  };

  return (
    <div className="form-popup-overlay">
      <div className="form-popup">
        <button className="close-button" onClick={onClose}>
        ❌
        </button>
        <h2>Budget Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="limit">Limit</label>
            <input
              type="number"
              id="limit"
              placeholder={0}
              value={limit}
              onChange={handleLimitChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="warnLimit">Warn Limit</label>
            <input
              type="number"
              id="warnLimit"
              placeholder={0}
              value={warnLimit}
              onChange={handleWarnLimitChange}
            />
          </div>
          <div>
            <span className='error-message'>{error}</span>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default BudgetFormPage;