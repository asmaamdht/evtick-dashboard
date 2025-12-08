// src/redux/slices/checkoutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../firebase/firebase.config";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// --- Action لتخزين checkout في Firestore ---
export const saveCheckout = createAsyncThunk(
  "checkout/saveCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const dataToSave = {
        ...checkoutData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "checkouts"), dataToSave);

      return dataToSave;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Action لجلب checkouts بتاعت المستخدم ---
export const fetchUserCheckouts = createAsyncThunk(
  "checkout/fetchUserCheckouts",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const q = query(
        collection(db, "checkouts"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Action جديد لجلب آخر checkout (للـ checkout page)
export const fetchLatestCheckout = createAsyncThunk(
  "checkout/fetchLatestCheckout",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const q = query(
        collection(db, "checkouts"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;

      const checkouts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      const latest = checkouts.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      })[0];

      return latest;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    data: null,
    userCheckouts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // saveCheckout
      .addCase(saveCheckout.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(saveCheckout.fulfilled, (state, action) => { 
        state.loading = false; 
        state.data = action.payload; 
      })
      .addCase(saveCheckout.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // fetchUserCheckouts
      .addCase(fetchUserCheckouts.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchUserCheckouts.fulfilled, (state, action) => { 
        state.loading = false; 
        state.userCheckouts = action.payload; 
      })
      .addCase(fetchUserCheckouts.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // fetchLatestCheckout
      .addCase(fetchLatestCheckout.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchLatestCheckout.fulfilled, (state, action) => { 
        state.loading = false; 
        state.data = action.payload; 
      })
      .addCase(fetchLatestCheckout.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      });
  }
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;