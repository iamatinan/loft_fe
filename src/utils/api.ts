import { paths } from '@/paths';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('custom-auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('custom-auth-token');
      alert('Session expired or invalid. Please log in again.');
      window.location.href = paths.auth.signIn; // redirect ไป login
    }
    return Promise.reject(error);
  }
);

export default api;