import api from '../api/axios';

const authService = {
    registerAdmin: async (data) => {
        const response = await api.post('/register', data);
        return response.data;
    },
    loginAdmin: async (data) => {
        const response = await api.post('/login', data);
        return response.data;
    },

    registerStudent: async (data) => {
        const response = await api.post('/api/student/register', data);
        return response.data;
    },
    loginStudent: async (data) => {
        const response = await api.post('/api/student/login', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService;
