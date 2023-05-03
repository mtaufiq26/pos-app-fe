import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./store/cart/cartSlice";

export default configureStore({
  reducer: {
    cart: cartReducer
  },
});