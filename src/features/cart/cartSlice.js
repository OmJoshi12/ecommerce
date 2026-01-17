import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
};

const initialState = {
    items: loadCart(),
};

const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find((item) => item.id === product.id);

            if (existingItem) {
                const maxQty = typeof existingItem.stock === 'number' ? existingItem.stock : Infinity;
                existingItem.quantity = Math.min(maxQty, existingItem.quantity + 1);
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            saveCart(state.items);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
            saveCart(state.items);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                const maxQty = typeof item.stock === 'number' ? item.stock : Infinity;
                item.quantity = Math.min(maxQty, Math.max(1, quantity));
            }
            saveCart(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCart([]);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
