const getBaseUrl = () => {
  // If the backend has a custom URL in environment, use it. Otherwise, use localhost.
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Default development URL
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getBaseUrl();

/**
 * Custom request wrapper using fetch (avoiding full Axios load where possible, 
 * but Axios is in package.json so we can write an Axios client as requested).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
