import { RadialBarChart, RadialBar } from "recharts";

export default function TopSellingEventsAD({ data = [] }) {
    if (!data.length) {
        data = [{ name: "No Data", value: 100, fill: "#e5e7eb" }];
    }

    const capitalizeWords = (text = "") =>
        text
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    return (
        <div className="bg-green-100/20 p-4 rounded-2xl shadow-md flex justify-between">



            <div className="flex flex-col justify-center gap-3 ml-4">
                <h2 className="font-semibold mb-2 text-primary">Top Selling Events</h2>


                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-10">

                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                        ></span>

                        <span className="text-gray-700 text-sm font-medium">
                            {capitalizeWords(item.name)}
                        </span>

                        <span className="text-gray-500 text-sm ml-auto">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>


            {/* ==== Left: Chart ==== */}
            <div>

                <RadialBarChart
                    width={220}
                    height={220}
                    innerRadius="20%"
                    outerRadius="90%"
                    barSize={12}
                    data={data}
                >
                    <RadialBar
                        dataKey="value"
                        clockWise
                        background
                    />
                </RadialBarChart>
            </div>
        </div>
    );
}
