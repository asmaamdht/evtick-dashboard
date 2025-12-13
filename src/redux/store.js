import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import authReducer from "../auth/authSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    auth: authReducer,
    payment: paymentReducer,
  },

});
