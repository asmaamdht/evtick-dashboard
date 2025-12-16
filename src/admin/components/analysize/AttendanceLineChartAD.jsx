import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AttendanceLineChartAD({ data = [] }) {
    const chartData = data.length
        ? data
        : [{ date: "No Data", attendance: 0 }];

    const totalAttendance = data.reduce(
        (sum, d) => sum + (d.attendance || 0),
        0
    );

    return (
        <div className="bg-teal-100/20 p-4 rounded-2xl shadow-md">
            <h2 className="font-semibold text-center text-teal-700 mb-2">
                Active Attendance
            </h2>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-800 font-bold text-lg">
                    {totalAttendance}
                </span>
                <span className="text-gray-500 text-sm">
                    Total Attendees
                </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
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
                        }} />

                    <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="#0f9386"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
