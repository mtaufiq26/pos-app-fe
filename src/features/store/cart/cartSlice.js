import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.data.push(action.payload);
    },
    removeItem: (state, action) => {
      const index = state.data.findIndex((a) => (a.product_id == action.payload.product_id));
      state.data.splice(index, 1);
    },
    clear: (state) => {
      state.data = [];
    }
  }
});

export const { addToCart, clear, removeItem } = cartSlice.actions;

export default cartSlice.reducer;