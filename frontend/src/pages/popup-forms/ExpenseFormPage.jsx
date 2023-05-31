import React, { useState, useEffect } from 'react';
import { addExpense, getExpenses, updateExpense } from '../../services/expenseService';
import { getCurrentCycle } from '../../utils/cycle';
import '../../style/FormPopup.css';

function ExpenseFormPage({ initialData, onClose }) {
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };  

  useEffect(() => {
    if (initialData) {
      setMerchantName(initialData.merchant || '');
      setAmount(initialData.amount || '');
      setDate(initialData.date || formatDate(new Date()));
      setError(initialData.error || '');
    } else {
      setMerchantName('');
      setAmount('');
      setDate('');
      setError('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!merchantName || merchantName.trim() === '') {
      setError('Merchant name cannot be empty.');
      return;
    }
    
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      setError('Amount must be a non-negative number.');
      return;
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime()) || dateObj > new Date()) {
      setError('Date must be a valid date in the past.');
      return;
    }

    let expense = {
      merchant: merchantName,
      amount: amountNum,
      date: dateObj.toISOString(),
    }

    let res;
    if (initialData && initialData.id) {
      expense['id'] = initialData.id;
      res = await updateExpense(expense);
    } else {
      const cycle = getCurrentCycle();
      const expenses = await getExpenses(cycle);

      let id = 1;
      for (const expense of expenses) {
        if (expense.id > id) {
          id = expense.id;
        }
      }
      id++;
      
      expense['id'] = id;
      res = await addExpense(expense);
    }

    if (res) {
      setError('');
      onClose();
    } else {
      setError('Invalid expense. Check fields and try again.');
    }
  };

  return (
    <div className="form-popup-overlay">
      <div className="form-popup">
        <button className="close-button" onClick={onClose}>
        ❌
        </button>
        <h2>Expense Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="merchantName">Merchant Name</label>
            <input
              type="text"
              id="merchantName"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={formatDate(date)}
              onChange={(e) => setDate(e.target.value)}
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

export default ExpenseFormPage;