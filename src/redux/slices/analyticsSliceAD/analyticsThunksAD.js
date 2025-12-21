import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import moment from "moment";

//    Charts Data For Admin
export const getAnalyticsChartDataAD = createAsyncThunk(
    "analyticsAD/getChartData",
    async () => {

        // Get All Events 
        const allEvents = await getDocs(collection(db, "events"));
        const events = allEvents.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Get All Payments 
        const getPayments = await getDocs(collection(db, "payments"));
        const payments = getPayments.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Create Revenue Chart Using Payment Slice :
        const revenue = {};
        payments.forEach(payment => {
            const date = payment.createdAt?.toDate
                ? moment(payment.createdAt.toDate()).format("MMM DD")
                : "Unknown";

            revenue[date] = (revenue[date] || 0) + (Number(payment.amount) || 0);
        });

        const revenueChartData = Object.keys(revenue).map(date => ({
            name: date,
            value: revenue[date]
        }));

        // Create Events Chart :
        const eventsChart = {};
        events.forEach(event => {
            const month = event.date?.toDate
                ? moment(event.date.toDate()).format("MMM")
                : "Unknown";

            eventsChart[month] = (eventsChart[month] || 0) + 1;
        });

        const eventsChartData = Object.keys(eventsChart).map(month => ({
            name: month,
            value: eventsChart[month]
        }));

        // Create Tickets Chart ::
        let totalTickets = 0;
        let soldTickets = 0;

        events.forEach(event => {
            totalTickets += Number(event.totalTickets) || 0;
            soldTickets += Number(event.ticketsSold) || 0;
        });

        const ticketsChartData = [
            { name: "Sold", value: soldTickets },
            { name: "Available", value: totalTickets - soldTickets },
        ];

        // Create Attendanse Chart 
        const attendanceChartData = events
            .filter(e => e.activeAttendance > 0)
            .map(e => ({
                name: e.eventName,
                value: Number(e.activeAttendance) || 0
            }))
            .slice(0, 10);

        return {
            revenueChartData,
            eventsChartData,
            ticketsChartData,
            attendanceChartData,
        };
    }
);


// Analytics Card admins ::

export const getAllEventsAD = createAsyncThunk(
    "analyticsAD/getAllEvents",
    async () => {
        const snapshot = await getDocs(collection(db, "events"));
        return snapshot.size;
    }
);

export const getTotalRevenueAD = createAsyncThunk(
    "analyticsAD/getTotalRevenue",
    async () => {
        const paymentsSnap = await getDocs(collection(db, "payments"));
        let total = 0;

        paymentsSnap.docs.forEach(doc => {
            const data = doc.data();

            if (Array.isArray(data.tickets)) {
                data.tickets.forEach(ticket => {
                    total += Number(ticket.price || 0);
                });
            }
            total += Number(data.serviceFee) || 0;
        });

        return total;
    }
);

export const getTicketsSoldAD = createAsyncThunk(
    "analyticsAD/getTicketsSold",
    async () => {
        const events = await getDocs(collection(db, "events"));
        let sold = 0;

        events.docs.forEach(doc => {
            sold += Number(doc.data().ticketsSold) || 0;
        });

        return sold;
    }
);

export const getActiveAttendanceAD = createAsyncThunk(
    "analyticsAD/getActiveAttendance",
    async () => {
        const paymentsSnap = await getDocs(collection(db, "payments"));
        let active = 0;

        paymentsSnap.docs.forEach(doc => {
            const tickets = doc.data().tickets || [];
            active += tickets.length;
        });

        return active;
    }
);