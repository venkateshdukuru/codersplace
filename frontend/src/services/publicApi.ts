// frontend/src/services/publicApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create a separate instance for public endpoints (no auth headers)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// No auth interceptors for public API
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Public API error:', error);
    return Promise.reject(error);
  }
);

export default publicApi;