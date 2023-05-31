import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpendingDisplay from './components/SpendingDisplay';
import BudgetDisplay from './components/BudgetDisplay';
import AddExpense from './components/AddExpense';
import ExpensesList from './components/ExpensesList';
import { logout, isAuthenticated } from '../services/authService';
import exitImage from '../img/exit.png';
import '../style/DashboardPage.css';

function DashboardPage() {
  const [isLoading, setLoading] = useState(true);
  const [reloadListKey, setReloadListKey] = useState(1);
  const [reloadSpendingKey, setReloadSpendingKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated();
      setLoading(false);
      if (!authenticated) {
        navigate('/login');
      }
    }

    checkAuth();
  }, [navigate]);


  const modifiedExpenses = () => {
    setReloadSpendingKey(reloadSpendingKey + 2);
  };

  const refreshList = () => {
    setReloadListKey(reloadListKey + 2);
    setReloadSpendingKey(reloadSpendingKey + 2);
  };


  const handleLogout = async (event) => {
    event.preventDefault();
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div className='loading'>⌛</div>;
  }

  return (
    <div className='dashboard-container'>
      <div className='navigation-bar'>
        <img src={exitImage} alt='logout' onClick={handleLogout} className='exit-image' />
      </div>
      <div className='content-container'>
        <SpendingDisplay key={reloadSpendingKey} />
        <BudgetDisplay />
        <AddExpense addedExpense={refreshList} />
        <ExpensesList key={reloadListKey} modifiedExpenses={modifiedExpenses} />
      </div>
    </div>
  );
}

export default DashboardPage;