// src/redux/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

// ==========================
// Fetch all payments (for testing without filter)
export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAllPayments",
  async (_, { rejectWithValue }) => {
    try {
      const paymentsSnap = await getDocs(collection(db, "payments"));

      const payments = paymentsSnap.docs.map((doc) => {
        const data = doc.data();

        // تحويل أي Timestamps لـ JS Date
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
          eventDate: data.eventDate?.toDate?.() || null,
        };
      });

      console.log("All payments fetched:", payments);
      return payments;
    } catch (err) {
      console.error("Error fetching all payments:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ==========================
// Fetch payments by organizer
export const fetchOrganizerPayments = createAsyncThunk(
  "payment/fetchOrganizerPayments",
  async (organizerUid, { rejectWithValue }) => {
    try {
      const paymentsSnap = await getDocs(
        query(collection(db, "payments"), where("organizerUid", "==", organizerUid))
      );

      const payments = paymentsSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
          eventDate: data.eventDate?.toDate?.() || null,
        };
      });

      console.log(`Payments fetched for organizer UID ${organizerUid}:`, payments);
      return payments;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ==========================
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    organizerPayments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllPayments
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.organizerPayments = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchOrganizerPayments
      .addCase(fetchOrganizerPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.organizerPayments = action.payload;
      })
      .addCase(fetchOrganizerPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
