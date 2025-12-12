import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByOrganizer } from '../redux/slices/eventSlice';
import { fetchOrganizerPayments } from '../redux/slices/paymentSlice';
import dayjs from 'dayjs';

import Contextual from "../components/analysize/EventsByType";
import PBarChart from "../components/analysize/RevenueByEvent";
import PChart from "../components/analysize/TopSellingEvents";
import PLineChart from "../components/analysize/RevenueLineChart";
import ProgressChart from "../components/analysize/EventsByMode";


function AnalysizePage() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const user = currentUser || JSON.parse(localStorage.getItem("user"));

    const { events } = useSelector((state) => state.events);
    const { organizerPayments } = useSelector((state) => state.payment);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchEventsByOrganizer(user.uid));
            dispatch(fetchOrganizerPayments(user.uid));
        }
    }, [dispatch, user]);


    // Contextual Data (Events By Type) ::
    const contextualData = useMemo(() => {
        const typeCounts = {};
        events.forEach(e => {
            const type = e.type || "Other";
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        const colors = ["#6CA7FF", "#C9A7F5", "#FFD66B", "#96E6B3", "#F7A8C4"];
        return Object.keys(typeCounts).map((type, index) => ({
            name: type,
            value: typeCounts[type],
            color: colors[index % colors.length]
        }));
    }, [events]);

    // Progress Data (Events By Mode)
    const progressData = useMemo(() => {
        const modeCounts = {};
        let total = 0;
        events.forEach(e => {
            const mode = e.mode || "Unknown";
            modeCounts[mode] = (modeCounts[mode] || 0) + 1;
            total++;
        });
        const colors = { "offline": "#C9A7F5", "online": "#6CA7FF" }; // Map specific modes if known
        const defaultColors = ["#C9A7F5", "#6CA7FF", "#96E6B3"];

        return Object.keys(modeCounts).map((mode, index) => ({
            name: mode,
            value: total > 0 ? Math.round((modeCounts[mode] / total) * 100) : 0,
            fill: colors[mode.toLowerCase()] || defaultColors[index % defaultColors.length]
        }));
    }, [events]);

    // PLineChart Data (Revenue Over Time)
    const lineChartData = useMemo(() => {
        const revenueMap = {};
        organizerPayments.forEach(p => {
            const date = p.createdAt ? dayjs(p.createdAt).format("MMM DD") : "Unknown";
            if (date !== "Unknown") {
                revenueMap[date] = (revenueMap[date] || 0) + (Number(p.amount) || 0);
            }
        });
        return Object.keys(revenueMap).map(date => ({
            date,
            a: revenueMap[date],
            b: revenueMap[date] * 0.8
        })).slice(-7);
    }, [organizerPayments]);

    const totalRevenue = useMemo(() => {
        return organizerPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    }, [organizerPayments]);

    // PBarChart Data (Revenue by Event)
    const barChartData = useMemo(() => {
        const eventRevenue = {};
        organizerPayments.forEach(p => {
            const eventName = p.eventName || "Unknown";
            eventRevenue[eventName] = (eventRevenue[eventName] || 0) + (Number(p.amount) || 0);
        });

        if (organizerPayments.length === 0 && events.length > 0) {
            return events.map(e => ({
                name: e.eventName || e.title,
                value: (e.ticketsSold || 0) * 100
            })).slice(0, 10);
        }

        return Object.keys(eventRevenue).map(name => ({
            name,
            value: eventRevenue[name]
        })).slice(0, 10);
    }, [organizerPayments, events]);

    // PChart Data (Top Events by Tickets Sold)
    const radialData = useMemo(() => {
        // Sort Events By TicketsSold
        const sortedEvents = [...events].sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0)).slice(0, 4);
        const colors = ["#C9A7F5", "#6CA7FF", "#96E6B3", "#F7A8C4"];
        return sortedEvents.map((e, index) => ({
            name: e.eventName || e.title,
            value: e.ticketsSold || 0,
            fill: colors[index % colors.length]
        }));
    }, [events]);


    return (
        <div
            className="flex flex-col lg:grid gap-6 p-6"
            style={{
                gridTemplateColumns: "1.7fr 1.7fr 2fr",
                gridTemplateRows: "auto auto",
                gridTemplateAreas: `
                "contextual progress pline"
                "pbar pbar pchart"
                `,
            }}
        >
            <div style={{ gridArea: "contextual" }}>
                <Contextual data={contextualData} />
            </div>
            <div style={{ gridArea: "progress" }}>
                <ProgressChart data={progressData} />
            </div>
            <div style={{ gridArea: "pline" }}>
                <PLineChart data={lineChartData} total={totalRevenue} />
            </div>

            <div
                className="lg:-mt-[50px] z-10"
                style={{
                    gridArea: "pbar",
                    // marginTop: "-50px", // Moved to Tailwind lg:-mt-[50px]
                    // zIndex: 1, // Moved to Tailwind z-10
                }}
            >
                <PBarChart data={barChartData} />
            </div>

            <div style={{ gridArea: "pchart" }}>
                <PChart data={radialData} />
            </div>
        </div>
    );
}


export default AnalysizePage;