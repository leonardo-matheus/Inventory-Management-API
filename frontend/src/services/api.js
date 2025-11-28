import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// interceptor opcional para log de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response || error.message);
    throw error;
  }
);

export default api;