import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we'll just let the component handle it or use a global event
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
