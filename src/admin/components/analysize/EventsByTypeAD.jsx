import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function EventsByTypeAD({ data = [] }) {
    if (!data.length) {
        data = [
            { name: "No Data", value: 100, color: "#e5e7eb" }
        ];
    }
    return (
        <div className="bg-indigo-100/20 py-2 px-7 rounded-2xl shadow-md flex gap-6 justify-between">


            <div className="pt-6 flex flex-col justify-center gap-5">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-4">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-gray-700 text-sm font-medium">
                            {item.name}
                        </span>
                        <span className="text-gray-500 text-sm ml-auto">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>


            <div>
                <h2 className="font-semibold mb-3 text-primary">Events By Type</h2>

                <PieChart width={200} height={220}>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={(entry) => 80 + entry.value}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
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
                        }} />
                </PieChart>
            </div>
        </div>
    );
}
