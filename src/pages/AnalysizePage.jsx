import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByOrganizer } from '../redux/slices/eventSlice';
import { fetchOrganizerPayments } from '../redux/slices/paymentSlice';


import EventsByType from '../components/analysize/EventsByType';
import EventsByMode from '../components/analysize/EventsByMode';
import AttendanceLineChar from '../components/analysize/AttendanceLineChar';
import RevenueByEvent from '../components/analysize/RevenueByEvent';
import TopSellingEvents from '../components/analysize/TopSellingEvents';


function AnalysizePage() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    const { events } = useSelector((state) => state.events);
    const { organizerPayments } = useSelector((state) => state.payment);

    const organizerUID = currentUser?.uid;
    const organizerName = currentUser?.fullName;

    useEffect(() => {
        if (organizerUID && organizerName) {
            dispatch(fetchEventsByOrganizer(organizerUID));
            dispatch(fetchOrganizerPayments(organizerName));
        }
    }, [dispatch, organizerUID, organizerName]);

    // Contextual Data (Events By Type) ::
    const contextualData = useMemo(() => {
        const typeCounts = {};
        events.forEach(e => {
            const type = e.type || "Other";
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        const colors = ["#0f9386", "#6CA7FF", "#C9A7F5", "#96E6B3", "#F7A8C4"];
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
            const mode = e.mode || "Online";
            modeCounts[mode] = (modeCounts[mode] || 0) + 1;
            total++;
        });
        const colors = { "offline": "#0f9386", "online": "#6CA7FF" }; // Map specific modes if known
        const defaultColors = ["#0f9386", "#C9A7F5", "#6CA7FF", "#96E6B3"];

        return Object.keys(modeCounts).map((mode, index) => ({
            name: mode,
            value: total > 0 ? Math.round((modeCounts[mode] / total) * 100) : 0,
            fill: colors[mode.toLowerCase()] || defaultColors[index % defaultColors.length]
        }));
    }, [events]);

    // LineChart Data (Active Attendance Over Time)
    const attendanceTrend = useMemo(() => {
        const attendanceMap = {};

        organizerPayments.forEach(payment => {
            if (!Array.isArray(payment.tickets)) return;

            const date = payment.createdAt
                ? new Date(payment.createdAt.seconds
                    ? payment.createdAt.seconds * 1000
                    : payment.createdAt
                ).toISOString().split("T")[0]
                : null;

            if (!date) return;

            attendanceMap[date] =
                (attendanceMap[date] || 0) + payment.tickets.length;
        });

        return Object.keys(attendanceMap)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => ({
                date,
                attendance: attendanceMap[date],
            }));
    }, [organizerPayments]);


    // PBarChart Data (Revenue by Event)
    const barChartData = useMemo(() => {
        const eventRevenueMap = {};

        organizerPayments.forEach(payment => {
            // لو فيه tickets
            if (!Array.isArray(payment.tickets)) return;

            const eventName = payment.eventName || "Unknown Event";

            // حساب الإيراد من كل تذكرة
            const revenueFromTickets = payment.tickets.reduce(
                (sum, ticket) => sum + (Number(ticket.price) || 0),
                0
            );

            eventRevenueMap[eventName] =
                (eventRevenueMap[eventName] || 0) + revenueFromTickets;
        });

        // تحويل الكائن لمصفوفة وأخذ أعلى 10 أحداث
        return Object.entries(eventRevenueMap)
            .sort(([, aValue], [, bValue]) => bValue - aValue)
            .slice(0, 10)
            .map(([name, value]) => ({ name, value }));
    }, [organizerPayments]);




    // PChart Data (Top Events by Tickets Sold)


    const radialData = useMemo(() => {
        const eventSeatMap = {};

        organizerPayments.forEach(payment => {
            if (!Array.isArray(payment.tickets)) return;

            const eventName = payment.eventName || "Unknown Event";

            // Value = Seats
            const seatsCount = payment.tickets.length;

            eventSeatMap[eventName] =
                (eventSeatMap[eventName] || 0) + seatsCount;
        });

        const colors = ["#0f9386", "#C9A7F5", "#6CA7FF", "#96E6B3", "#F7A8C4"];

        return Object.entries(eventSeatMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, value], index) => ({
                name,
                value,
                fill: colors[index % colors.length],
            }));
    }, [organizerPayments]);


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
                <EventsByType data={contextualData} />
            </div>
            <div style={{ gridArea: "progress" }}>
                <EventsByMode data={progressData} />
            </div>
            <div style={{ gridArea: "pline" }}>
                <AttendanceLineChar data={attendanceTrend} />
            </div>

            <div
                className="lg:-mt-[50px] z-10"
                style={{
                    gridArea: "pbar",
                    // marginTop: "-50px", // Moved to Tailwind lg:-mt-[50px]
                    // zIndex: 1, // Moved to Tailwind z-10
                }}
            >
                <RevenueByEvent data={barChartData} />
            </div>

            <div style={{ gridArea: "pchart" }}>
                <TopSellingEvents data={radialData} />
            </div>
        </div>
    );
}


export default AnalysizePage;