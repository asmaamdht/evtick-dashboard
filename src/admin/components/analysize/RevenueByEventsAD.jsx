import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function RevenueByEventAD({ data = [] }) {
    const spendData = data.length ? data : [{ name: "No Data", value: 0 }];
    return (
        <div className="bg-indigo-100/20 p-2 rounded-2xl shadow-md w-full h-[310px]">
            <h2 className="font-semibold mb-2 text-center text-primary">Revenue By Event</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={spendData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                        dataKey="name"
                        tickFormatter={(value) =>
                            value ? value.charAt(0).toUpperCase() + value.slice(1) : value
                        }
                        tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: "#6b7280" }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickLine={{ stroke: "#6b7280" }}
                        axisLine={{ stroke: "#6b7280" }}
                    />
                    <Tooltip
                        cursor={false}
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
                    <Bar dataKey="value" fill="#0f9386" radius={[10, 10, 10, 10]} activeBar={false} />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}
