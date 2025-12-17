import React, { useState } from "react";
import dayjs from "dayjs";
import DayEvent from "./DayEvent";
import { useSelector } from "react-redux";
// import { fetchEventsByOrganizer } from "../../../redux/slices/eventSlice";
import DashboardCalendar from "./DashboardCalender";

function DayEvents() {

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


    // const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    // console.log("Events from Redux:", events);
    // const user = JSON.parse(localStorage.getItem("user"));

    const [selectedDate, setSelectedDate] = useState(dayjs());

    // useEffect(() => {
    //     if (user && user.uid) {
    //         dispatch(fetchEventsByOrganizer(user.uid));
    //     } else {
    //         "No Events"
    //     }
    // }, [dispatch, user]);

    return (
        <div className="flex flex-col md:flex-row  gap-4 w-full">
            <DayEvent
                class="flex-1 bg-gray-100 p-4"
                events={events}
                selectedDate={selectedDate}
            />

            <DashboardCalendar
                events={events}
                // class="flex-1 bg-gray-100 p-4"
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
        </div>
    );
}

export default DayEvents;
