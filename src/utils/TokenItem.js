// src/utils/TokenItem.js
import axios from 'axios';
import { API_URL } from './ApiRuta';

const tokenItem = axios.create({
  baseURL: API_URL,
});

tokenItem.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  const sessionToken = localStorage.getItem('session_token');

  if (access) {
    config.headers['Authorization'] = `Bearer ${access}`;
  }

  if (sessionToken) {
    config.headers['X-Session-Token'] = sessionToken;
  }

  return config;
});

export default tokenItem;
