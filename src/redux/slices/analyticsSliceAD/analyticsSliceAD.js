import { createSlice } from "@reduxjs/toolkit";
import {
    getAllEventsAD,
    getTotalRevenueAD,
    getTicketsSoldAD,
    getActiveAttendanceAD,
    getAnalyticsChartDataAD,
} from "./analyticsThunksAD";

const initialState = {
    totalEvents: 0,
    totalRevenue: 0,
    ticketsSold: 0,
    activeAttendance: 0,
    loading: false,
    error: null,

    revenueChartData: [],
    eventsChartData: [],
    ticketsChartData: [],
    attendanceChartData: [],
};

const analyticsSliceAD = createSlice({
    name: "analyticsAD",
    initialState,
    reducers: {
        resetAnalyticsAD: (state) => {
            state.totalEvents = 0;
            state.totalRevenue = 0;
            state.ticketsSold = 0;
            state.activeAttendance = 0;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllEventsAD.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllEventsAD.fulfilled, (state, action) => {
                state.loading = false;
                state.totalEvents = action.payload;
            })
            .addCase(getAllEventsAD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getTotalRevenueAD.fulfilled, (state, action) => {
                state.totalRevenue = action.payload;
            })

            .addCase(getTicketsSoldAD.fulfilled, (state, action) => {
                state.ticketsSold = action.payload;
            })

            .addCase(getActiveAttendanceAD.fulfilled, (state, action) => {
                state.activeAttendance = action.payload;
            })

            .addCase(getAnalyticsChartDataAD.fulfilled, (state, action) => {
                state.revenueChartData = action.payload.revenueChartData;
                state.eventsChartData = action.payload.eventsChartData;
                state.ticketsChartData = action.payload.ticketsChartData;
                state.attendanceChartData = action.payload.attendanceChartData;
            });
    },
});

export const { resetAnalyticsAD } = analyticsSliceAD.actions;
export default analyticsSliceAD.reducer;
