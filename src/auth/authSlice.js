import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null, // will load saved user
  role: localStorage.getItem("role") || null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;

   if (action.payload) {
    localStorage.setItem("user", JSON.stringify(action.payload)); // save user object
  } else {
    localStorage.removeItem("user");
  }
},
    setRole: (state, action) => {
      state.role = action.payload;
      if (action.payload) {
        localStorage.setItem("role", action.payload);
      } else {
        localStorage.removeItem("role");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.role = null;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, setRole, setLoading, logoutUser } = authSlice.actions;
export default authSlice.reducer;