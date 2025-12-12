import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function RevenueByEvent({ data = [] }) {
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#C9A7F5" radius={[10, 10, 10, 10]} />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}
