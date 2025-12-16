import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AttendanceLineChar({ data = [] }) {
    const chartData = data.length
        ? data.map(d => ({ date: d.date, a: d.attendance }))
        : [{ date: "No Data", a: 0 }];

    const totalAttendance = data.reduce((sum, d) => sum + (d.attendance || 0), 0);

    return (
        <div className="bg-purple-100/20 p-4 rounded-2xl shadow-md">
            <div className="flex flex-col  mb-3">
                <h2 className="font-semibold text-center text-primary mb-1">Attendance Trend</h2>
                <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-lg">{totalAttendance}</span>
                    <span className="text-gray-500 text-sm text-left">Total Attendees</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        formatter={(value) => value.toLocaleString()}
                        contentStyle={{
                            backgroundColor: "transparent",
                            border: 0,
                            borderRadius: "8px",
                            padding: "5px 10px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        }}
                        itemStyle={{ color: "#333" }}
                    />
                    <Line type="monotone" dataKey="a" stroke="#0f9386" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
