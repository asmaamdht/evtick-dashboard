import { RadialBarChart, RadialBar } from "recharts";

export default function EventsByModeAD({ data = [] }) {
    if (!data.length) {
        data = [{ name: "No Data", value: 100, fill: "#e5e7eb" }];
    }
    return (
        <div className="bg-blue-100/20 p-4 rounded-2xl shadow-md flex justify-between">


            <div className="flex flex-col justify-center gap-3 ml-4">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                        ></span>

                        <span className="text-sm font-medium text-gray-700">
                            {item.name}
                        </span>

                        <span className="text-sm text-gray-500 ml-auto">
                            {item.value}%
                        </span>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="font-semibold text-primary ">Events By Mode</h2>

                <RadialBarChart
                    width={220}
                    height={220}
                    innerRadius="20%"
                    outerRadius="90%"
                    barSize={12}
                    data={data}
                >
                    <RadialBar
                        minAngle={10}
                        background
                        clockWise
                        dataKey="value"
                    />
                </RadialBarChart>
            </div>
        </div>
    );
}
