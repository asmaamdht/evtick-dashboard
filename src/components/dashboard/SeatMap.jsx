import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

// StageLine Component ::
const StageLine = () => {
    return (
        <div className="w-full flex justify-center mb-6">
            <svg
                width="80%"
                height="40"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,40 Q50,0 100,40"
                    stroke="#0CBBAA"
                    strokeWidth="2"
                    fill="transparent"
                />
            </svg>
        </div>
    );
};

const SeatMap = ({ event }) => {
    const [seatModel, setSeatModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seatStatusMap, setSeatStatusMap] = useState({});

    const smallConfig = {
        left: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "L" },
        center: { rows: [1, 2, 3, 4, 5, 6], seats: 10, prefix: "C" },
        right: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "R" }
    };

    const mediumRows = ["A", "B", "C", "D", "E", "F", "G"];
    const mediumSeatsPerRow = 12;

    useEffect(() => {
        const fetchSeatModel = async () => {
            // 1. Resolve Model ID
            const modelId = event?.venue?.seatModel || event?.seatModel;

            if (!modelId) {
                setSeatModel(null);
                setSeatStatusMap({});
                return;
            }

            setLoading(true);
            try {
                const docRef = doc(db, "seatModel", modelId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSeatModel(docSnap.data());
                } else {
                    console.error("No such seat model document!");
                    setSeatModel(null);
                }
            } catch (error) {
                console.error("Error fetching seat model:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeatModel();
    }, [event]);

    // Calculate Seat Statuses
    useEffect(() => {
        if (!event) return;

        const statusMap = {};

        if (event.bookedSeats && Array.isArray(event.bookedSeats)) {
            event.bookedSeats.forEach(booking => {
                const seatId = `${booking.row}${booking.seat}`;
                statusMap[seatId] = "booked";
            });
        }

        if (event.seatMap) {
            Object.keys(event.seatMap).forEach(key => {
                if (event.seatMap[key] === true) {
                    statusMap[key] = "booked";
                }
            });
        }

        setSeatStatusMap(statusMap);

    }, [event]);


    if (!event) return <div className="text-gray-500 p-4 text-center">Select an event to view seat map.</div>;
    if (loading) return <div className="text-primary p-4 text-center">Loading seat map...</div>;
    if (!seatModel) return <div className="text-gray-500 p-4 text-center">No seat model found.</div>;

    const renderSeat = (seatId, size = "medium") => {
        const status = seatStatusMap[seatId] || "available";


        let colorClass = "";

        if (status === "booked") {
            colorClass = "bg-primary text-white";
        } else if (status === "unavailable") {
            colorClass = "bg-gray-600 text-gray-400 opacity-50 cursor-default";
        } else {
            // Available 
            colorClass = "bg-gray-300 text-textColor";
        }

        const sizeClass = size === "small"
            ? "w-6 h-6 md:w-8 md:h-8 text-[8px] md:text-[10px]"
            : "w-10 h-10 text-sm";
        const shapeClass = size === "small"
            ? "rounded-t-lg rounded-b-sm"
            : "rounded-t-2xl rounded-b-sm";

        return (
            <div
                key={seatId}
                title={`${seatId} - ${status}`}
                className={`
                    ${sizeClass}
                    flex items-center justify-center font-semibold
                    ${colorClass}
                    ${shapeClass}
                    shadow-sm cursor-default flex-shrink-0 transition-transform hover:scale-105
                `}
            >
                {seatId}
            </div>
        );
    };

    // Use Medium Map ::
    const renderMediumMap = () => {
        return (
            <div className="space-y-6 max-h-[420px] max-w-full overflow-y-auto overflow-x-auto scrollbar-hide p-2">
                {mediumRows.map((row) => (
                    <div key={row} className="flex flex-wrap justify-center gap-4">
                        {[...Array(mediumSeatsPerRow)].map((_, i) => {
                            const seatId = `${row}${i + 1}`;
                            return renderSeat(seatId, "medium");
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // Use Small Map ::
    const renderSmallSection = (rows, seatsPerRow, isAngled = false, angleDir = "left", prefix) => {
        let seatCounter = 1;
        return (
            <div className={`flex flex-col gap-1 ${isAngled ? (angleDir === "left" ? "rotate-12 translate-y-4" : "-rotate-12 translate-y-4") : ""}`}>
                {rows.map((row) => (
                    <div key={row} className="flex justify-center gap-1">
                        {[...Array(seatsPerRow)].map(() => {
                            const seatId = `${prefix}${seatCounter}`;
                            seatCounter++;
                            return renderSeat(seatId, "small");
                        })}
                    </div>
                ))}
            </div>
        );
    };

    const renderSmallMap = () => {
        const { left, center, right } = smallConfig;
        return (
            <div className="flex justify-start md:justify-center items-start gap-8 md:gap-16 mt-4 px-5 pb-8 overflow-x-auto w-full min-h-[300px]">
                {/* Left Section */}
                <div className="mt-6 flex-shrink-0">
                    {renderSmallSection(left.rows, left.seats, true, "left", left.prefix)}
                </div>

                {/* Center Section */}
                <div className="flex-shrink-0">
                    {renderSmallSection(center.rows, center.seats, false, "center", center.prefix)}
                </div>

                {/* Right Section */}
                <div className="mt-6 flex-shrink-0">
                    {renderSmallSection(right.rows, right.seats, true, "right", right.prefix)}
                </div>
            </div>
        );
    };


    return (
        <div className="pt-4 py-6 pb-4 rounded-xl shadow-xl bg-gray-500 overflow-hidden text-white w-full h-full">
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

            <div className="w-full flex justify-center">
                {seatModel.name === "Small" ? renderSmallMap() : renderMediumMap()}
            </div>

        </div>
    );
};

export default SeatMap;
