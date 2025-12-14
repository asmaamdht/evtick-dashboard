import { createSlice } from "@reduxjs/toolkit";
import {
    getOrganizerEvents,
    getTotalRevenue,
    getTicketsSold,
    getActiveAttendance,
    getAnalyticsChartData,
} from "./analyticsThunks";

const initialState = {
    upcomingEvents: 0,
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

const analyticsCardSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        resetAnalytics: (state) => {
            state.upcomingEvents = 0;
            state.totalRevenue = 0;
            state.ticketsSold = 0;
            state.activeAttendance = 0;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrganizerEvents.pending, (state) => { state.loading = true; })
            .addCase(getOrganizerEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.upcomingEvents = action.payload;
            })
            .addCase(getOrganizerEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getTotalRevenue.fulfilled, (state, action) => {
                state.totalRevenue = action.payload;
            })

            .addCase(getTicketsSold.fulfilled, (state, action) => {
                state.ticketsSold = action.payload;
            })

            .addCase(getActiveAttendance.fulfilled, (state, action) => {
                state.activeAttendance = action.payload;
            })

            .addCase(getAnalyticsChartData.fulfilled, (state, action) => {
                state.revenueChartData = action.payload.revenueChartData;
                state.eventsChartData = action.payload.eventsChartData;
                state.ticketsChartData = action.payload.ticketsChartData;
                state.attendanceChartData = action.payload.attendanceChartData;
            });
    },
});

export const { resetAnalytics } = analyticsCardSlice.actions;
export default analyticsCardSlice.reducer;
