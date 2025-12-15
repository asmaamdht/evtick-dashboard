import React from "react";
import StageLine from "../StageLine";

const defaultConfig = {
  left: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "L" },
  center: { rows: [1, 2, 3, 4, 5, 6], seats: 10, prefix: "C" },
  right: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "R" }
};

export default function SmallSeatMap({ seatMap = {}, totalPrice = 0, config = defaultConfig }) {
  const { left, center, right } = config;

  const renderSeat = (seatId) => {
    const seatStatus = seatMap[seatId];
    const isFaded = seatStatus === null || seatStatus === undefined;
    return (
      <div
        key={seatId}
        className={`
                    w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[8px] md:text-[10px] font-semibold
                    ${isFaded
            ? "bg-gray-300 text-textColor"
            : seatStatus
              ? "bg-primary text-white"
              : "bg-gray-600 text-gray-400 opacity-50 cursor-default"
          }
                    rounded-t-lg rounded-b-sm shadow-sm cursor-pointer flex-shrink-0 transition-transform hover:scale-110
                `}
        title={seatId}
      >
        {seatId}
      </div>
    );
  };

  const renderSection = (rows, seatsPerRow, isAngled = false, angleDir = "left", prefix) => {
    let seatCounter = 1;
    return (
      <div className={`flex flex-col gap-1 ${isAngled ? (angleDir === "left" ? "rotate-12 translate-y-4" : "-rotate-12 translate-y-4") : ""}`}>
        {rows.map((row) => (
          <div key={row} className="flex justify-center gap-1">
            {[...Array(seatsPerRow)].map((_, i) => {
              const seatId = `${prefix}${seatCounter}`;
              seatCounter++;
              return renderSeat(seatId);
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-4 py-6 pb-4 rounded-xl shadow-xl bg-gray-500 overflow-hidden">
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
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

      <div className="flex justify-start md:justify-center items-start gap-8 md:gap-16 mt-4 px-5 pb-8 overflow-x-auto w-full min-h-[300px]">
        {/* Left Section */}
        <div className="mt-6 flex-shrink-0">
          {renderSection(left.rows, left.seats, true, "left", left.prefix || "L")}
        </div>

        {/* Center Section */}
        <div className="flex-shrink-0">
          {renderSection(center.rows, center.seats, false, "center", center.prefix || "C")}
        </div>

        {/* Right Section */}
        <div className="mt-6 flex-shrink-0">
          {renderSection(right.rows, right.seats, true, "right", right.prefix || "R")}
        </div>
      </div>

      <div className="mt-4 flex justify-end pr-8">
        <span className="text-white font-bold text-lg">
          Total: {totalPrice} EGP
        </span>
      </div>
    </div>
  );
}