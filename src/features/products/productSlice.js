import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch products with pagination and category
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ limit, skip, category }, { rejectWithValue }) => {
        try {
            let url = `/products?limit=${limit}&skip=${skip}`;
            if (category && category !== 'all') {
                url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
            }
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/products/categories');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const initialState = {
    products: [],
    categories: [],
    total: 0,
    status: 'idle',
    error: null,
    filters: {
        category: 'all',
    },
    pagination: {
        limit: 12, // Items per page
        skip: 0,
        currentPage: 1,
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.filters.category = action.payload;
            state.pagination.skip = 0; // Reset to first page
            state.pagination.currentPage = 1;
        },
        setPage: (state, action) => {
            const page = action.payload;
            state.pagination.currentPage = page;
            state.pagination.skip = (page - 1) * state.pagination.limit;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.total = action.payload.total;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    },
});

export const { setCategory, setPage } = productSlice.actions;
export default productSlice.reducer;
