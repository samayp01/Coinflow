import React, { useState } from 'react';
import ExpenseFormPage from '../popup-forms/ExpenseFormPage';
import ReceiptFormPage from '../popup-forms/ReceiptFormPage';
import '../../style/AddExpense.css';

function AddExpense({ addedExpense }) {
  const [isExpenseFormOpen, setExpenseFormOpen] = useState(false);
  const openExpenseForm = () => setExpenseFormOpen(true);
  const closeExpenseForm = () => {
    setExpenseFormOpen(false);
    addedExpense();
  };

  const [initialData, setInitialData] = useState(null);


  const [isReceiptFormOpen, setReceiptFormOpen] = useState(false);
  const openReceiptForm = () => setReceiptFormOpen(true);
  const closeReceiptForm = (parsedReceiptData) => {
    setReceiptFormOpen(false);
    if (parsedReceiptData && parsedReceiptData.date) {
      setInitialData(parsedReceiptData);
      openExpenseForm();
    } else {
      setInitialData(null);
    }
  }

  return (
    <div className="display-container">
      <div>
        <div className="add-section-button">
          <button onClick={openReceiptForm}>Add Expense</button>
        </div>
        {isReceiptFormOpen && <ReceiptFormPage onClose={closeReceiptForm} />}
        {isExpenseFormOpen && <ExpenseFormPage onClose={closeExpenseForm} initialData={initialData} />}
      </div>
    </div>
  );
}

export default AddExpense;