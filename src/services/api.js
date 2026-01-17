import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token if it exists
api.interceptors.request.use(
  (config) => {
    const url = String(config.url || '');
    const isAuthEndpoint = url.startsWith('/auth/login') || url.startsWith('/auth/refresh');
    const token = localStorage.getItem('token');
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
