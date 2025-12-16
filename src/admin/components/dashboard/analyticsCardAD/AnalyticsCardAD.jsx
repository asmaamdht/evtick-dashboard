import React from "react";
import { useSelector } from "react-redux";
import CircularChartAD from "./CircularChartAD";

function AnalyticsCardAD() {
    const {
        totalEvents,
        totalRevenue,
        ticketsSold,
        activeAttendance,
    } = useSelector((state) => state.analyticsAD);

    const analyticsData = [
        {
            title: "Events",
            text: "Events",
            value: totalEvents,
            bgColor: "bg-blue-100/20",
            chartColor: "#0f9386",
        },
        {
            title: "Total Revenue",
            text: "EGP",
            value: totalRevenue,
            bgColor: "bg-green-100/20",
            chartColor: "#22c55e",
        },
        {
            title: "Tickets Sold",
            text: "Tickets",
            value: ticketsSold,
            bgColor: "bg-purple-100/20",
            chartColor: "#a855f7",
        },
        {
            title: "Active Attendance",
            text: "Active",
            value: activeAttendance,
            bgColor: "bg-indigo-100/20",
            chartColor: "#6366f1",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analyticsData.map((item, index) => (
                <div
                    key={index}
                    className={`flex justify-between py-4 px-4 rounded-xl shadow-lg backdrop-blur-md ${item.bgColor}`}
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-600 text-xl font-semibold">{item.title}</div>
                        <div className="text-2xl text-gray-800 font-semibold font-header">
                            {item.title === "Total Revenue"
                                ? `${Number(item.value).toLocaleString("en-US")} EGP`
                                : `${item.value} ${item.text}`}
                        </div>

                    </div>

                    <div>
                        <CircularChartAD
                            value={item.value}
                            maxValue={
                                item.title === "Total Revenue" ? 100000 :
                                    item.title === "Events" ? 200 :
                                        item.title === "Tickets Sold" ? 5000 :
                                            item.title === "Active Attendance" ? 1000 :
                                                100
                            }
                            color={item.chartColor}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}


export default AnalyticsCardAD;