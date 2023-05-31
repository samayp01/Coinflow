import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const COOKIE_NAME = 'jwt';

const getHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`
  };
};

const instance = axios.create({
  baseURL: `${REACT_APP_API_URL}/budgets`
});


export async function getBudget(cycle) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.get(`?cycle=${cycle}`, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}

export async function addBudget(budget) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.post('/', budget, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}

export async function updateBudget(budget) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.put('/', budget, { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}

export async function deleteBudget() {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.delete('/', { headers: headers })
    .then(res => { return res.data })
    .catch(err => { return null });
}