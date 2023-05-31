import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const COOKIE_NAME = 'jwt';

const getHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`
  };
}

const instance = axios.create({
  baseURL: `${REACT_APP_API_URL}/expenses`
});


export async function getExpense(cycle, id) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.get(`?cycle=${cycle}&id=${id}`, { headers: headers })
    .then(res => { return res.data; })
    .catch(err => { return null });
}

export async function getExpenses(cycle) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.get(`?cycle=${cycle}`, { headers: headers })
    .then(res => { return res.data; })
    .catch(err => { return null });
}

export async function addExpense(expense) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.post('/', expense, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}

export async function updateExpense(expense) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.put('/', expense, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}

export async function deleteExpense(id) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));
  
  return instance.delete(`?id=${id}`, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}