import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const COOKIE_NAME = 'jwt';

const getHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`
  };
}

const instance = axios.create({
  baseURL: `${REACT_APP_API_URL}/auth`
});

export async function isAuthenticated() {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.get('/token', { headers: headers })
    .then(res => { return res.status >= 200 && res.status < 300 })
    .catch(err => { return false; });
}

export async function login(id) {
  return instance.post('/login', { id })
    .then(res => { return res.data })
    .catch(err => { return false; });
}

export async function verify(id, code) {
  return instance.post('/verify', { id, code })
    .then(res => { 
      if (!res.data || !res.data.jwt) return false;
      localStorage.setItem(COOKIE_NAME, res.data.jwt);
      return res.data;
    })
    .catch(err => { return false; });
}

export async function logout() {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));

  return instance.get('/logout', { headers: headers })
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        localStorage.removeItem(COOKIE_NAME);
        return true;
      }
      return false;
    })
    .catch(err => { return false; });
}