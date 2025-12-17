import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";



// Get Data For The Organizer From FireStore And Create Charts ::
export const getAnalyticsChartData = createAsyncThunk(
    "analytics/getChartData",

    async (organizerUid) => {

        // Get Events For The Organizer By UID :
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const eventsSnapshot = await getDocs(eventsQuery);

        const events = eventsSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(),
        }));


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
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const organizerEventsSnap = await getDocs(eventsQuery);

        const events = organizerEventsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate?.() || null,
            };
        });

        return events.length;
    }
);



export const getTicketsSold = createAsyncThunk(
    "analytics/getTicketsSold",
    async (organizerUid) => {
        const eventsQuery = query(
            collection(db, "events"),
            where("organizerUid", "==", organizerUid)
        );
        const eventsSnap = await getDocs(eventsQuery);

        let totalTicketsSold = 0;
        eventsSnap.docs.forEach(doc => {
            const data = doc.data();
            totalTicketsSold += Number(data.ticketsSold || 0);
        });

        return totalTicketsSold;
    }
);

export const getTotalRevenue = createAsyncThunk(
    "analytics/getTotalRevenue",
    async (organizerUid) => {
        const paymentsQuery = query(
            collection(db, "payments"),
            where("organizerUid", "==", organizerUid)
        );
        const paymentsSnap = await getDocs(paymentsQuery);

        let total = 0;

        paymentsSnap.docs.forEach(doc => {
            const data = doc.data();

            if (Array.isArray(data.tickets)) {
                data.tickets.forEach(ticket => {
                    total += Number(ticket.price || 0);
                });
            }
        });

        return total;
    }
);

// export const getActiveAttendance = createAsyncThunk(
//     "analytics/getActiveAttendance",
//     async () => {
//         const paymentsSnap = await getDocs(collection(db, "payments"));
//         let active = 0;

//         paymentsSnap.docs.forEach(doc => {
//             const tickets = doc.data().tickets || [];
//             active += tickets.length;
//         });

//         return active;
//     }
// );


export const getActiveAttendance = createAsyncThunk(
    "analytics/getActiveAttendance",
    async (organizerUid) => {
        const payments = query(
            collection(db, "payments"),
            where("organizerUid", "==", organizerUid)
        );
        const paymentsSnap = await getDocs(payments);

        let active = 0;

        paymentsSnap.docs.forEach(doc => {
            const tickets = doc.data().tickets || [];
            active += tickets.length;
        });

        return active;
    }
);