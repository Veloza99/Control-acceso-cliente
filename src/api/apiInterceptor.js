import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3300/api', // Cambia esto a tu URL base
});

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

export default api;
