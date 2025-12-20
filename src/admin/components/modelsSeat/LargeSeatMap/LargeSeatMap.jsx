import React from "react";
import StageLine from "../StageLine";

const defaultTables = [
    // Top Row (Arc of 5)
    { id: 1, seats: 5, x: 70, y: 50 },
    { id: 2, seats: 5, x: 270, y: 20 },
    { id: 3, seats: 5, x: 470, y: 10 },
    { id: 4, seats: 5, x: 670, y: 20 },
    { id: 5, seats: 5, x: 870, y: 50 },

    // Middle Row (Arc of 4)
    { id: 6, seats: 5, x: 170, y: 200 },
    { id: 7, seats: 5, x: 370, y: 180 },
    { id: 8, seats: 5, x: 570, y: 180 },
    { id: 9, seats: 5, x: 770, y: 200 },

    // Bottom Row (Arc of 3)
    { id: 10, seats: 5, x: 270, y: 350 },
    { id: 11, seats: 5, x: 470, y: 320 },
    { id: 12, seats: 5, x: 670, y: 350 },
];

export default function LargeSeatMap({ seatMap = {}, totalPrice = 0, config = defaultTables }) {

    const renderSeat = (tableId, seatIndex, totalSeats) => {
        const seatId = `T${tableId}-S${seatIndex + 1}`;
        const seatStatus = seatMap[seatId];
        // Calculate position on numbering circle
        const angle = (seatIndex / totalSeats) * 360 - 90;
        const radius = 35; // Distance from center of table

        const style = {
            transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`
        };

        return (
            <div
                key={seatId}
                style={style}
                className={`
            absolute w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm cursor-pointer
            ${seatStatus === undefined || seatStatus === null
                        ? "bg-gray-300 text-gray-800 hover:bg-white" // Available
                        : seatStatus
                            ? "bg-primary text-white" // Booked
                            : "bg-gray-600 text-gray-400" // Unavailable
                    }
        `}
                title={seatId}
            >
                {seatIndex + 1}
            </div>
        );
    };

    const renderTable = (table) => {
        return (
            <div
                key={table.id}
                className="absolute"
                style={{ left: table.x, top: table.y }}
            >
                {/* Table Circle */}
                <div className="relative w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center shadow-md z-10">
                    <span className="text-gray-700 font-bold text-sm">{table.id}</span>
                </div>

                {/* Seats Container (Centered on table) */}
                <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
                        {[...Array(table.seats)].map((_, i) => renderSeat(table.id, i, table.seats))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="pt-8 pb-8 rounded-xl shadow-xl bg-gray-500 overflow-hidden relative">
            {/* Legend */}
            <div className="flex justify-center gap-6 mb-8 relative z-20">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-white text-sm">Available</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-white text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-white text-sm">Unavailable</span>
                </div>
            </div>

            <StageLine />

            {/* Tables Container - Scrollable */}
            <div className="w-full overflow-x-auto overflow-y-hidden px-4 pb-8 mt-4">
                <div className="relative w-[1000px] min-h-[450px] mx-auto">
                    {config.map(renderTable)}
                </div>
            </div>

            <div className="mt-4 flex justify-end pr-8 relative z-20">
                <span className="text-white font-bold text-lg">
                    Total: {totalPrice} EGP
                </span>
            </div>
        </div>
    );
}
