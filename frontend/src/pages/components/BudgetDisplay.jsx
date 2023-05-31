import React, { useState, useEffect } from 'react';
import { getBudget, deleteBudget } from '../../services/budgetService';
import BudgetFormPage from '../popup-forms/BudgetFormPage';
import ConfirmationDialog from './ConfirmationDialog';
import { getCurrentCycle } from '../../utils/cycle';
import '../../style/BudgetDisplay.css';

function BudgetDisplay() {

  const [hasBudget, setHasBudget] = useState(false);
  const [limit, setLimit] = useState('');
  const [warnLimit, setWarnLimit] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [key, setKey] = useState(0);
  const [initialData, setInitialData] = useState(null);

  const reloadComponent = () => {
    setKey(key + 1);
  };

  const [isBudgetFormOpen, setBudgetFormOpen] = useState(false);
  const openBudgetForm = () => setBudgetFormOpen(true);
  const closeBudgetForm = () => {
    reloadComponent();
    setBudgetFormOpen(false);
    setInitialData(null);
  }

  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  useEffect(() => {
    async function getMonthlyBudget() {
      const cycle = getCurrentCycle();
      const budget = await getBudget(cycle);

      if (!budget) {
        setHasBudget(false);
        return;
      }

      setHasBudget(true);
      setLimit(formatAmount(budget.limit));
      setWarnLimit(formatAmount(budget.warnLimit));
      setInitialData(budget);
    }

    getMonthlyBudget();
  }, [key]);

  const confirmDeleteBudget = async () => {
    const success = await deleteBudget();
    if (success) {
      setHasBudget(false);
    }
    setConfirmDelete(false);
    reloadComponent();
  };

  const closeConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const handleBudgetDelete = () => {
    setConfirmDelete(true);
  };

  return (
    <div className="display-container">
      {!hasBudget && (
        <div>
          <div className="add-section-button">
            <button onClick={openBudgetForm}>Add Budget</button>
          </div>
          {isBudgetFormOpen && <BudgetFormPage onClose={closeBudgetForm} />}
        </div>
      )}

      {hasBudget && (
        <div className="budget-display">
          <div className="budget-title-container">
            <div className="budget-title" 
              title={`Warn limit at $${warnLimit}`}
              >
              Target Limit
            </div>
          </div>
          <div className="budget-content">
            <div className="budget-limit" onClick={openBudgetForm}>
              ${limit}
            </div>            
          </div>
          <button className="edit-button" onClick={openBudgetForm}>Edit</button>
          <button className="delete-button" onClick={handleBudgetDelete}>Remove</button>

          {isBudgetFormOpen && <BudgetFormPage onClose={closeBudgetForm} initialData={initialData} />}
          {confirmDelete && 
            <ConfirmationDialog 
              onCancel={closeConfirmDelete} 
              onConfirm={confirmDeleteBudget} 
              message={'Permanently delete your budget?'}
              />
          }
        </div>
      )}
    </div>
  );
}

export default BudgetDisplay;