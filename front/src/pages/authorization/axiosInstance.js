import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Ваш базовый URL для API
    withCredentials: true, // Включение использования cookie
});

// Получение CSRF-токена и установка его в заголовки
axiosInstance.interceptors.request.use(config => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRFToken'] = token;
    }
    return config;
});

export default axiosInstance;
