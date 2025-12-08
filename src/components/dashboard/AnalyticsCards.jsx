import React from "react";
import { FaCalendarAlt, FaDollarSign, FaTicketAlt, FaUsers } from "react-icons/fa";

const analyticsData = [
    {
        title: "Upcoming Events",
        value: 12,
        icon: <FaCalendarAlt className="text-2xl text-primary" />,
        bgColor: "bg-blue-100/20",
    },
    {
        title: "Total Revenue",
        value: "$75,000",
        icon: <FaDollarSign className="text-2xl text-green-500" />,
        bgColor: "bg-green-100/20",
    },
    {
        title: "Tickets Sold",
        value: 4300,
        icon: <FaTicketAlt className="text-2xl text-purple-500" />,
        bgColor: "bg-purple-100/20",
    },
    {
        title: "Active Attendance",
        value: 7500,
        icon: <FaUsers className="text-2xl text-indigo-500" />,
        bgColor: "bg-indigo-100/20",
    },
];

export default function AnalyticsCards() {
    return (
        <div className="flex flex-wrap gap-4">
            {analyticsData.map((item, index) => (
                <div
                    key={index}
                    className={`flex items-start p-4 rounded-xl shadow-lg backdrop-blur-md ${item.bgColor} w-[230px]`}
                >
                    <div className="mr-5">{item.icon}</div>
                    <div>
                        <div className="text-gray-500 text-sm">{item.title}</div>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
