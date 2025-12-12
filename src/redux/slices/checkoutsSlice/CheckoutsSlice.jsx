import { createSlice } from "@reduxjs/toolkit";
import { getOrganizerCheckouts } from "./CheckoutsThunks";

const initialState = {
    checkouts: [],
    loading: false,
    error: null,
};

const checkoutsSlice = createSlice({
    name: "checkouts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrganizerCheckouts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizerCheckouts.fulfilled, (state, action) => {
                state.loading = false;
                state.checkouts = action.payload;
            })
            .addCase(getOrganizerCheckouts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkoutsSlice;