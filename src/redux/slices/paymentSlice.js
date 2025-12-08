// src/redux/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../firebase/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Action لحفظ Payment في Firebase
export const savePayment = createAsyncThunk(
  "payment/savePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const dataToSave = {
        ...paymentData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: "completed"
      };

      const docRef = await addDoc(collection(db, "payments"), dataToSave);

      return { id: docRef.id, ...dataToSave };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    currentPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPayment(state) {
      state.currentPayment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(savePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;