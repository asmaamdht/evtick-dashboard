// SeatMap.jsx
import React from "react";
import StageLine from "./StageLine";

export default function SeatMap({ seatMap = {}, totalPrice = 0 }) {
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const seatsPerRow = 12;

    return (
        <div className="pt-4 py-6 pb-4 rounded-xl shadow-xl bg-gray-500">
            <div className="flex justify-center gap-6 mb-2">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-200  rounded"></div>
                    <span className="text-white text-sm">Available</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-primary  rounded"></div>
                    <span className="text-white text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-white text-sm">Unavailable</span>
                </div>
            </div>

            <StageLine />

            <div className="space-y-6 max-h-[420px] max-w-full overflow-y-auto overflow-x-auto scrollbar-hide">
                {rows.map((row) => (
                    <div key={row} className="flex flex-wrap justify-center gap-4">
                        {[...Array(seatsPerRow)].map((_, i) => {
                            const seatId = `${row}${i + 1}`;
                            const seatStatus = seatMap[seatId];
                            const isFaded = seatStatus === null || seatStatus === undefined;

                            return (
                                <div
                                    key={seatId}
                                    className={`
                                        w-10 h-10 flex items-center justify-center text-sm font-semibold
                                        
                                        ${isFaded
                                            ? "bg-gray-300 text-textColor"
                                            : seatStatus
                                                ? "bg-primary text-white"
                                                : "bg-gray-600 text-gray-400 opacity-50 cursor-default"
                                        }
                                                rounded-t-2xl
                                                rounded-b-sm
                                                shadow-sm
                                                cursor-pointer
                                                flex-shrink-0
                                                `}
                                >
                                    {seatId}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end pr-8">
                <span className="text-white font-bold text-lg">
                    Total: {totalPrice} EGP
                </span>
            </div>
        </div>
    );
}
