import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send httpOnly cookie
  headers: { 'Content-Type': 'application/json' },
});

export default api;
