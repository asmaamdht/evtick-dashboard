import React, { useState } from "react";
import dayjs from "dayjs";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";

const DashboardCalendar = ({ events = [] }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    const dayEvents = events.filter(
        (e) =>
            dayjs(e.date).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
    );

    return (
        <div className="flex flex-col gap-4 w-[360px] max-w-md">

            <div className="bg-white/20 backdrop-blur-md  rounded-xl shadow-lg min-h-[260px]">

                {dayEvents.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {dayEvents.map((e, i) => (
                            <div key={i}>
                                {e.image && (
                                    <img
                                        src={e.image}
                                        alt={e.title}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                )}

                                <div key={i} className="flex flex-col gap-3 pl-3 pb-3">

                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-lg">{e.title}</div>
                                        {e.location && (
                                            <div className="text-gray-400 text-xs flex items-center gap-1">
                                                {e.location}
                                            </div>
                                        )}
                                    </div>

                                    {e.description && (
                                        <div className="text-gray-600 text-sm">
                                            {e.description}
                                        </div>
                                    )}

                                    {(e.date || e.time) && (
                                        <div className="flex gap-2 text-gray-500 text-xs items-start">
                                            <div className="flex items-center justify-center bg-white rounded-md w-7 h-7">
                                                <AiOutlineCalendar className="text-primary text-lg" />
                                            </div>

                                            <div className="flex flex-col leading-tight">
                                                {e.date && <span>{dayjs(e.date).format("DD MMM, YYYY")}</span>}
                                                {e.time && <span>{e.time}</span>}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 text-sm">No events</div>
                )}
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-lg h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg text-primary">
                        {currentDate.format("MMMM YYYY")}
                    </h2>

                    <div className="flex gap-1">
                        <button
                            onClick={prevMonth}
                            className=" text-gray-500 w-8 h-8 flex items-center justify-center rounded-full font-bold hover:bg-second transition text-lg"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={nextMonth}
                            className=" text-gray-500 w-8 h-8 flex items-center justify-center rounded-full font-bold hover:bg-second transition text-lg"
                        >
                            &gt;
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center font-semibold mb-3 text-gray-600">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {daysArray.map((day, idx) => (
                        <div
                            key={idx}
                            className={`h-8 w-8 flex items-center justify-center cursor-pointer text-gray-500 rounded-full ${day &&
                                dayjs()
                                    .date(day)
                                    .isSame(selectedDate, "day") &&
                                "bg-primary text-white"
                                } hover:bg-primary hover:text-white transition`}
                            onClick={() => day && setSelectedDate(currentDate.date(day))}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default DashboardCalendar;