import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";



// Get Data For The Organizer From FireStore And Create Charts ::
export const getAnalyticsChartData = createAsyncThunk(
    "analytics/getChartData",

    async (organizerUid) => {
        console.log("organizerUid:", organizerUid);

        // Get Events For The Organizer By UID :
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


        // Get Payments For The Organizer By UID :
        const paymentsQuery = query(
            collection(db, "payments"),
            where("organizerUid", "==", organizerUid)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Payments:", payments);
        // Add Revenue Chart By using Payments Collection :

        const revenue = {};
        payments.forEach(payment => {
            const date = payment.createdAt?.toDate ? moment(payment.createdAt.toDate()).format("MMM DD") : "Unknown";
            revenue[date] = (revenue[date] || 0) + (Number(payment.amount) || 0);
        });

        console.log("Revenue:", revenue);

        const revenueChartData = Object.keys(revenue).map(date => ({
            name: date,
            value: revenue[date]
        }));

        const eventsChart = {};
        events.forEach(event => {
            const month = event.date?.toDate ? moment(event.date.toDate()).format("MMM") : "Unknown";
            eventsChart[month] = (eventsChart[month] || 0) + 1;
        });
        console.log("Events chart:", eventsChart);
        const eventsChartData = Object.keys(eventsChart).map(month => ({
            name: month,
            value: eventsChart[month]
        }));

        // Add TotalTickets Chart By using Events Collection :

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
        console.log("Tickets chart data:", ticketsChartData);

        // Add Attendance Chart By using Users Collection : 

        const attendanceChartData = events
            .filter(e => e.activeAttendance > 0)
            .map(e => ({
                name: e.eventName,
                value: Number(e.activeAttendance) || 0
            }))
            .slice(0, 10);

        console.log("Attendance chart data:", attendanceChartData);

        return {
            revenueChartData,
            eventsChartData,
            ticketsChartData,
            attendanceChartData
        };
    }
);


// Analytics Card In Dashboard ::

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

        let totalRevenue = 0;
        payments.docs.forEach(doc => {
            totalRevenue += Number(doc.data().amount) || 0;
        });

        return totalRevenue;
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

        let totalTicketsSold = 0;
        events.docs.forEach(doc => {
            totalTicketsSold += Number(doc.data().ticketsSold) || 0;
        });

        return totalTicketsSold;
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

        let activeUser = 0;
        events.docs.forEach(doc => {
            activeUser += Number(doc.data().activeAttendance) || 0;
        });

        return activeUser;
    }
);
