import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootSlice";
import authReducer from "./authSlice";
import fetchReducer from "./fetchSlice";
import cartReducer from "../view/cart/reducer/cartSlice";
import prodStorageReducer from "../view/_prodStorage/reducer/ProdStorageSlice";
import analysisReducer from "../view/dashboard/analysisSlice";
import orderReducer from "../view/order/reducer/orderSlice";
import {
  // loadState,
  saveState,
} from "./localStorage";
import throttle from "lodash/throttle";
export const store = configureStore({
  reducer: {
    root: rootReducer,
    auth: authReducer,
    fetch: fetchReducer,
    cart: cartReducer,
    prodStorage: prodStorageReducer,
    analysis: analysisReducer,
    order: orderReducer,
  },
});

store.subscribe(
  throttle(() => {
    const { carts, curCart } = store.getState().cart;
    const { orders } = store.getState().order;
    const { settings } = store.getState().root;
    const { userInfo } = store.getState().auth;
    // saveState("carts", carts);
    saveState("curCart", curCart);
    saveState("orders", orders);
    saveState("settings", settings);
    saveState("userInfo", userInfo);
  }, 1000)
);
