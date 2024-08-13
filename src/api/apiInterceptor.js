import axios from 'axios';

const baseURL = 'http://localhost:3300/api'; // Asegúrate de actualizar la URL base según tu configuración

const api = axios.create({
    baseURL, // Utiliza la URL base definida arriba
    withCredentials: true // Permite el envío de cookies con las solicitudes
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    }
);

export default api;
