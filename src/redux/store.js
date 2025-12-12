import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import authReducer from "../auth/authSlice";
import paymentReducer from "./slices/paymentSlice";
import analyticsReducer from "./slices/analyticsCardSlice/analyticsCardSlics";
import checkoutReducer from "./slices/checkoutsSlice/CheckoutsSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    auth: authReducer,
    payment: paymentReducer,
    AnalyticsCards: analyticsReducer,
    checkoutsSlice: checkoutReducer,
  },

});
