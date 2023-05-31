import React, { useState, useEffect } from 'react';
import { getExpenses } from '../../services/expenseService';
import { getCurrentCycle } from '../../utils/cycle';
import '../../style/SpendingDisplay.css';

function SpendingDisplay() {
  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    let timer = null;
    let delay = 20;

    const startCounting = () => {
      timer = setInterval(() => {
        setDisplayAmount((prevDisplayAmount) => {
          const increment = Math.ceil((amount - prevDisplayAmount) / 10);
          const newValue = prevDisplayAmount + increment;
          
          if (newValue >= amount) {
            clearInterval(timer);
            return amount;
          }

          return newValue;
        });
        delay += 20;
      }, delay);
    };

    async function getMonthlySpending() {
      const cycle = getCurrentCycle();
      const expenses = await getExpenses(cycle);

      if (!expenses || expenses.length === 0) {
        setAmount(0);
        setDisplayAmount(0);
        return;
      }

      let total = 0;
      for (const expense of expenses) {
        total += expense.amount;
      }

      setAmount(total);
      startCounting();
    }

    getMonthlySpending();

    return () => {
      clearInterval(timer);
    };
  }, [amount]);

  return (
    <div className="display-container">
      <div className="spending-display">
        ${formatAmount(displayAmount)}
      </div>
    </div>
  );
}

export default SpendingDisplay;