import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";

export const getAnalyticsChartData = createAsyncThunk(
    "analytics/getChartData",
    async (organizerUid) => {
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const paymentsQuery = query(
            collection(db, "payments"),
            where("organizerUid", "==", organizerUid)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const revenueMap = {};
        payments.forEach(payment => {
            const date = payment.createdAt?.toDate ? moment(payment.createdAt.toDate()).format("MMM DD") : "Unknown";
            revenueMap[date] = (revenueMap[date] || 0) + (Number(payment.amount) || 0);
        });

        const revenueChartData = Object.keys(revenueMap).map(date => ({
            name: date,
            value: revenueMap[date]
        }));


        const eventsMap = {};
        events.forEach(event => {
            const month = event.date?.toDate ? moment(event.date.toDate()).format("MMM") : "Unknown";
            eventsMap[month] = (eventsMap[month] || 0) + 1;
        });
        const eventsChartData = Object.keys(eventsMap).map(month => ({
            name: month,
            value: eventsMap[month]
        }));


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
            attendanceChartData
        };
    }
);

export const getOrganizerEvents = createAsyncThunk(
    "analytics/getOrganizerEvents",
    async (organizerUid) => {
        // const now = new Date();
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid),
            // where("date", ">=", now)
        );

        const organizerEvents = await getDocs(eventsQuery);
        return organizerEvents.size;
    }
);

export const getTotalRevenue = createAsyncThunk(
    "analytics/getTotalRevenue",
    async (organizerUid) => {
        const paymentsQuery = query(
            collection(db, "payments"),
            where("organizerUid", "==", organizerUid)
        );
        const payments = await getDocs(paymentsQuery);

        let total = 0;
        payments.docs.forEach(doc => {
            total += Number(doc.data().amount) || 0;
        });

        return total;
    }
);
export const getTicketsSold = createAsyncThunk(
    "analytics/getTicketsSold",
    async (organizerUid) => {
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const events = await getDocs(eventsQuery);

        let total = 0;
        events.docs.forEach(doc => {
            total += Number(doc.data().ticketsSold) || 0;
        });

        return total;
    }
);

export const getActiveAttendance = createAsyncThunk(
    "analytics/getActiveAttendance",
    async (organizerUid) => {
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const events = await getDocs(eventsQuery);

        let active = 0;
        events.docs.forEach(doc => {
            active += Number(doc.data().activeAttendance) || 0;
        });

        return active;
    }
);
