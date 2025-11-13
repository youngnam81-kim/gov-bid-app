// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const USER_NAME_KEY = 'userName';
export const USER_ID_KEY = 'userId';

// 비동기 로그인 액션
export const login = createAsyncThunk(
    'auth/login',
    async ({ userId, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { userId, password });
            const token = response.data.token;
            const userName = response.data.user.userName || 'null'; // 백엔드에서 userName을 받아오거나 userId 사용
            userId = response.data.user.userId;

            localStorage.setItem(ACCESS_TOKEN_KEY, token);
            localStorage.setItem(USER_NAME_KEY, userName); // <<-- userName도 localStorage에 저장
            localStorage.setItem(USER_ID_KEY, userId);

            return { token, userName, userId }; // Redux 상태 업데이트를 위해 token과 userName을 리턴
        } catch (error) {
            const message = error.response?.data?.message || '로그인 실패';
            return rejectWithValue(message);
        }
    }
);

// 인증 Slice 정의
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem(ACCESS_TOKEN_KEY) || null,
        userName: localStorage.getItem(USER_NAME_KEY) || null, // <<-- 초기 상태에서 localStorage에서 userName 로드
        userId: localStorage.getItem(USER_ID_KEY) || null,
        isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
        isLoading: false,
        error: null,
    },
    reducers: {
        // 로그아웃 액션
        logout: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(USER_NAME_KEY); // <<-- 로그아웃 시 localStorage에서 userName 제거
            localStorage.removeItem(USER_ID_KEY);
        },
        // 사용자 이름 설정 (필요에 따라 외부에서 userName 업데이트 시 사용)
        setUsername: (state, action) => {
            state.userName = action.payload;
            // setUsername 액션으로 userName이 변경될 때도 localStorage에 반영
            if (action.payload) {
                localStorage.setItem(USER_NAME_KEY, action.payload);
            } else {
                localStorage.removeItem(USER_NAME_KEY);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.userName = action.payload.userName; // <<-- Redux 상태에도 userName 업데이트
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
                state.token = null;
                state.userName = null; // 로그인 실패 시 userName 초기화
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(USER_NAME_KEY); // 로그인 실패 시 localStorage userName도 제거
            });
        // fetchUserInfo 관련 extraReducers는 모두 제거합니다.
    },
});

export const { logout, setUsername } = authSlice.actions; // 액션 내보내기
export default authSlice.reducer; // 리듀서 내보내기