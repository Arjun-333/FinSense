import axios from 'axios';

// Create Axios instance pointing to the real backend
// Create Axios instance
const isMobile = window.navigator.userAgent.includes('Capacitor');
const baseURL = isMobile ? 'http://10.190.183.229:5000/api' : 'http://localhost:5000/api';

const API = axios.create({
    baseURL,
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
