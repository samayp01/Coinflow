import React, { useState, useEffect } from 'react';
import { deleteExpense } from '../../services/expenseService';
import ExpenseFormPage from '../popup-forms/ExpenseFormPage';
import ConfirmationDialog from './ConfirmationDialog';
import '../../style/ExpenseEntry.css';

function ExpenseEntry({ expense, onChange }) {
  const [id, setId] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    function setEntry() {
      setId(expense.id);
      setMerchant(expense.merchant.toUpperCase());
      setAmount(expense.amount);
      setDate(expense.date);
      setInitialData(expense);
    }

    setEntry();
  }, [expense]);

  const [initialData, setInitialData] = useState(null);

  const [isExpenseFormOpen, setExpenseFormOpen] = useState(false);
  const openExpenseForm = () => setExpenseFormOpen(true);
  const closeExpenseForm = () => {
    onChange();
    setExpenseFormOpen(false);
    setInitialData(null);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const confirmDeleteExpense = async () => {
    await deleteExpense(id);
    onChange();
    setConfirmDelete(false);
  };

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  const formatName = (name) => {
    if (name.length > 16) {
      return name.substring(0, 13) + "...";
    }
    return name;
  };

  return (
    <div className="display-container">
      <div className="entry-item">
          <div onClick={openExpenseForm} className='merchant-and-date'>
            <div className='field'>{formatName(merchant)}</div>
            <div className='field'>{formatDate(date)}</div>
          </div>
          <div onClick={openExpenseForm} className='field' id='amount'>${amount}</div>
        
        <button className='delete-button' onClick={handleDelete}>✖</button>

        {confirmDelete && 
          <ConfirmationDialog 
            onCancel={closeConfirmDelete} 
            onConfirm={confirmDeleteExpense} 
            message={'Permanently delete expense?'}
            />
        }
        {isExpenseFormOpen && <ExpenseFormPage onClose={closeExpenseForm} initialData={initialData} />}
      </div>
    </div>
  );
}

export default ExpenseEntry;