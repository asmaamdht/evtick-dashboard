import React from "react";
import DashboardCalendar from "./DashboardCalendar";

const Events = [
    {
        title: "Event 1",
        date: "2025-12-08",
        time: "18:30",
        description: "This is a sample description for Event 1.",
        location: "Cairo, Egypt",
        image: "src/assets/images/home_bg.jpg"
    },

];

function CustomEvents() {
    return (
        <div>
            <DashboardCalendar events={Events} />
        </div>
    );
}

export default CustomEvents;
