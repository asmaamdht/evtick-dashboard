import React, { useState } from "react";
import dayjs from "dayjs";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";


const DashboardCalendar = ({ selectedDate, setSelectedDate }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
    const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    return (
        <div className="bg-white backdrop-blur-md p-4 rounded-xl shadow-lg h-[330px] flex-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-primary">
                    {currentDate.format("MMMM YYYY")}
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="text-textColor text-xl font-bold flex items-center justify-center rounded-full hover:bg-second transition p-1"
                    >
                        <AiOutlineLeft />
                    </button>

                    <button
                        onClick={nextMonth}
                        className="text-textColor text-xl font-bold flex items-center justify-center rounded-full hover:bg-second transition p-1"
                    >
                        <AiOutlineRight />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center font-semibold mb-3 text-textColor">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysArray.map((day, idx) => {
                    const dayObj = day && currentDate.date(day);

                    return (
                        <div
                            key={idx}
                            className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
                                ${dayObj
                                    ? dayObj.isSame(selectedDate, "day")
                                        ? "bg-primary text-white"
                                        : "text-[#b3b0c3] hover:bg-primary hover:text-white transition"
                                    : ""
                                }
                            `}
                            onClick={() => day && setSelectedDate(dayObj)}>
                            {day || ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(DashboardCalendar);
