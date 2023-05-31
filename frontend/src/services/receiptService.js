import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const COOKIE_NAME = 'jwt';

const getHeaders = (token) => {
  return {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  };
}

const instance = axios.create({
  baseURL: `${REACT_APP_API_URL}/receipt`
});


export async function recognizeReceipt(imageFile) {
  const headers = getHeaders(localStorage.getItem(COOKIE_NAME));
  
  const formdata = new FormData();
  formdata.append('receipt-pic', imageFile);

  return instance.post('/recognize', formdata, { headers: headers })
    .then(res => { return res.data; })
    .catch(err => { return null });
}