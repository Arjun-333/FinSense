import axios from 'axios';

// Create Axios instance pointing to the real backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Standard local backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Interceptor to attach Token
API.interceptors.request.use((config) => {
    const user = localStorage.getItem('user'); // Or however you store the token
    if (user) {
        const token = JSON.parse(user).token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
