import React, { useState, useEffect } from 'react';
import { getExpenses } from '../../services/expenseService';
import ExpenseEntry from './ExpenseEntry';
import { dateToCycle, getCurrentCycle } from '../../utils/cycle';
import '../../style/ExpensesList.css';

function ExpensesList({ modifiedExpenses }) {
  const [key, setKey] = useState(0);
  const [date, setDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function getExpenseList() {
      const cycle = dateToCycle(date) || getCurrentCycle();
      const expenses = await getExpenses(cycle);

      if (!expenses || expenses.length === 0) {
        setExpenses([]);
        return;
      }

      expenses.sort((a, b) => b.date - a.date);
      setExpenses(expenses);
    }

    getExpenseList();
  }, [date, key]);

  const formatDate = (dateString) => {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(5, 7), 10) - 1;
    return new Date(year, month);
  }

  const handleDateChange = (e) => {
    const selectedDate = formatDate(e.target.value);
    setDate(selectedDate);
  };

  const handleElementChange = () => {
    setKey(key + 1);
    modifiedExpenses();
  };


  return (
    <div className="display-container">
      <div className='expense-list'>
        <div className='date-selector'>
          <input type="month" id="date" value={date.toISOString().substring(0, 7)} onChange={handleDateChange} />
        </div>

        {(expenses && expenses.length !== 0 && expenses.map((expense) => (
          <ExpenseEntry key={expense.id} expense={expense} onChange={handleElementChange} />
        ))) || <p>No expenses found.</p>}
      </div>
    </div>
  );
}

export default ExpensesList;