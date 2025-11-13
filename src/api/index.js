// src/api/index.js
import axios from 'axios';
import { ACCESS_TOKEN_KEY } from '../store/authSlice';

// import store from '../store'; // Redux Store를 import하여 로그아웃 액션 디스패치

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리 (예: 401 Unauthorized 시 로그아웃)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // window.location.href = '/login' 등 로그인 페이지로 리디렉션
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            console.log('401 Unauthorized. Access token removed from localStorage.');
        }
        return Promise.reject(error);
    }
);

export default api;