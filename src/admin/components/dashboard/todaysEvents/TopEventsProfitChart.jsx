import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#6CA7FF", "#C9A7F5", "#96E6B3", "#FFD36C"];

const TopEventsProfitChart = () => {
    const events = useSelector((state) => state.events.events);
    const Commission = 0.1;

    const eventsWithProfit = events.map((event) => {
        const seats = Array.isArray(event.bookedSeats) ? event.bookedSeats : [];
        const profit = seats.reduce((sum, seat) => {
            const seatPrice = event.price?.[seat.row] || 0;
            return sum + seatPrice * Commission;
        }, 0);

        return { name: event.eventName, profit };
    });

    const topEvents = eventsWithProfit
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 4);

    return (
        <div className="bg-white rounded-xl w-full max-w-md mx-auto p-4">
            <h2 className="text-gray-500 mb-4 font-semibold">
                Top 4 Events Profit
            </h2>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={topEvents}
                        dataKey="profit"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={false}
                    >
                        {topEvents.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `${value.toLocaleString()} EGP`}
                        contentStyle={{
                            backgroundColor: "transparent",
                            border: 0,
                            borderRadius: "8px",
                            padding: "5px 10px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        }}
                        itemStyle={{
                            color: "#333",
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap -mx-2">
                {topEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-2 px-2 w-1/2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        <span className="text-[10px] font-medium text-textColor">
                            {event.name.charAt(0).toUpperCase() + event.name.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopEventsProfitChart;
