// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // <--- 여기서 authReducer를 임포트

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;