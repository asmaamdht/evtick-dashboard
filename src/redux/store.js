import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import authReducer from "../auth/authSlice";
import paymentReducer from "./slices/paymentSlice";
import analyticsReducer from "./slices/analyticsSlice/analyticsSlice";
import analyticsADReducer from "./slices/analyticsSliceAD/analyticsSliceAD";
import checkoutsSlice from "./slices/checkoutSlice/checkoutSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    auth: authReducer,
    payment: paymentReducer,
    analyticsCards: analyticsReducer,
    analyticsAD: analyticsADReducer,
    checkouts: checkoutsSlice.reducer,

  },

});
