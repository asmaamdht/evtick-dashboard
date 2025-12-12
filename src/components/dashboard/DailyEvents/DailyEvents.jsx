import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import DashboardCalendar from "./DashboardCalendar";
import DayEvents from "./DayEvents";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, fetchEventsByOrganizer } from "../../../redux/slices/eventSlice";

function DailyEvents() {

    // const mockEvents = [
    //     {
    //         title: "React Workshop",
    //         description: "Learn the basics of React.js and build a simple project. Learn the basics of React.js and build a simple project.",
    //         location: "Room 201, IT Building",
    //         date: new Date("2025-12-11"),
    //         time: "10:00 AM - 1:00 PM",
    //         totalTickets: 150,
    //         createdAt: new Date("2025-12-11T09:56:19Z"),
    //         image: "https://i.pinimg.com/736x/9d/76/99/9d7699bb7e9e07a2849bdfaaec82f6ed.jpg"
    //     },
    //     {
    //         title: "Networking Meetup",
    //         description: "Discuss latest trends in networking and cybersecurity.",
    //         location: "Conference Hall A",
    //         date: new Date("2025-12-12"),
    //         time: "2:00 PM - 5:00 PM",
    //         totalTickets: 150,
    //         image: "https://source.unsplash.com/400x200/?network,meeting"
    //     },
    //     {
    //         title: "Web Design Seminar",
    //         description: "Modern UI/UX design techniques and tools.",
    //         location: "Room 105",
    //         date: new Date("2025-12-13"),
    //         time: "11:00 AM - 12:30 PM",
    //         totalTickets: 150,
    //         image: "https://source.unsplash.com/400x200/?web,design"
    //     }
    // ];


    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const user = JSON.parse(localStorage.getItem("user"));

    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchEventsByOrganizer(user.uid));
        } else {
            dispatch(fetchAllEvents());
        }
    }, [dispatch, user]);

    return (
        <div className="flex flex-col xl:flex-row gap-4 w-full">
            <DayEvents
                events={events}
                selectedDate={selectedDate}
            />


            <DashboardCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
        </div>
    );
}

export default DailyEvents;
