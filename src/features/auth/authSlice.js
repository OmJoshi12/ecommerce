import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { ...credentials, expiresInMins: 60 });
            const { accessToken, token, refreshToken, ...user } = response.data;
            const resolvedAccessToken = accessToken || token;
            localStorage.setItem('token', resolvedAccessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));
            return { user, accessToken: resolvedAccessToken, refreshToken };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Login failed'
            );
        }
    }
);

export const fetchMe = createAsyncThunk(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch user'
            );
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchMe.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.token = null;
                state.error = action.payload;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
