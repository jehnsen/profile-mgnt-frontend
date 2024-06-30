import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptors
apiClient.interceptors.request.use(
  (config) => {
    // auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// response interceptors
apiClient.interceptors.response.use(
  (response) => response, // Any status code within the range of 2xx causes this function to trigger
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    // Handle specific error cases (e.g., token expiration, redirect to login)
    if (error.response?.status === 401) {
      // Handle unauthorized error, e.g., redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            throw new Error('Unauthorized access. Please login.');
        } else if (error.response?.status === 404) {
            throw new Error('Resource not found.');
        } else {
            throw new Error('An unexpected error occurred.');
        }
    } else {
        throw new Error('A network error occurred. Please try again later.');
    }
};

export default apiClient
