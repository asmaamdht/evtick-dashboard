import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
// import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function RevenueLineChart({ data = [], total = 0 }) {
    const chartData = data.length ? data : [
        { date: "No Data", a: 0, b: 0 }
    ];
    // const total = 46567.23;
    // const change = -33.45; 
    return (
        <div className="bg-purple-100/20 p-4 rounded-2xl shadow-md">
            <div className="flex items-center justify-center mb-2">

                <h2 className="font-semibold text-center text-primary">Revenue Trend</h2>

                {/* <select className="text-sm rounded-lg px-2 py-1">
                    <option>Last week</option>
                    <option>Last month</option>
                    <option>Last year</option>
                </select> */}
            </div>

            <div className="flex items-center gap-3 mb-3">
                <span className="text-primary font-bold text-lg">
                    {total.toLocaleString()}
                </span>

                <span className="text-gray-500 text-sm">/ Per Month</span>

                {/* <span
                    className={`flex items-center text-sm font-medium ${change < 0 ? "text-red-500" : "text-green-500"
                        }`}
                >
                    {change < 0 ? <FaArrowDown className="mr-1" /> : <FaArrowUp className="mr-1" />}
                    {change}%
                </span> */}
            </div>

            <LineChart width={450} height={220} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Line type="monotone" dataKey="a" stroke="#C9A7F5" strokeWidth={3} />
                <Line type="monotone" dataKey="b" stroke="#A9E7DF" strokeWidth={3} />
            </LineChart>
        </div>
    );
}
