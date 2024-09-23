import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

// Добавляем интерсептор для установки токена перед каждым запросом
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
