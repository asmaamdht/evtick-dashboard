import React, { useMemo } from "react";
import dayjs from "dayjs";

import { AiOutlineEnvironment } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import NoEvent from "./NoEvent";



const DayEvent = ({ events = [], selectedDate }) => {
    const navigate = useNavigate();

    const dayEvents = useMemo(() => {
        return events
            .filter(e => {
                const dateField = e.date;
                if (!dateField) return false;

                // const eventDate = dateField.toDate ? dayjs(dateField.toDate()) : dayjs(dateField);
                const eventDate = dayjs(e.date);
                return eventDate.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
            })
            .sort((a, b) => {
                if (a.time && b.time) {
                    const timeA = dayjs(`2000-01-01 ${a.time.split('-')[0]}`);
                    const timeB = dayjs(`2000-01-01 ${b.time.split('-')[0]}`);
                    return timeA.diff(timeB);
                }
                return 0;
            })
            .slice(0, 1);
    }, [events, selectedDate]);



    return (
        <div className="flex-1 backdrop-blur-md rounded-xl h-[330px]">

            {dayEvents.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {dayEvents.map((e, i) => (
                        <div key={i}>
                            {(e.photo) && (

                                <div className="relative w-full h-40  rounded-tl-xl rounded-tr-xl overflow-hidden">
                                    <img
                                        src={e.photo}
                                        alt={e.eventName}
                                        className="w-full h-full object-cover"
                                    />

                                    {e.date  && (
                                        <span className="absolute top-2 left-2 bg-black/50 text-white text-[11px] px-2 py-1 rounded-md backdrop-blur-sm">
                                            {dayjs(e.date).format("MMMM DD, YYYY • hh:mm A")}
                                        </span>
                                    )}

                                </div>
                            )}

                            <div className="flex flex-col gap-1 px-3">


                                <div className="flex justify-between">
                                    <div className="font-semibold text-lg pt-2">{e.eventName}</div>

                                    {e.totalTickets && (
                                        <div className="flex items-center gap-1 text-textColor text-xs pt-1">
                                            <p ><span className="font-semibold text-2xl text-primary">{e.totalTickets}</span> Tickets</p>
                                        </div>
                                    )}
                                </div>


                                {e.location && (
                                    <div className="flex items-center gap-1 text-gray-400 text-x">
                                        <AiOutlineEnvironment className="text-primary text-x" />
                                        <span >{e.location}</span>
                                    </div>
                                )}

                                {e.description && (
                                    <div className="text-gray-600 text-sm line-clamp-2">
                                        {e.description}
                                    </div>
                                )}


                                <div className="flex items-center justify-between mt-2">
                                    {/* Revenue */}
                                    <div className="flex flex-col text-xs">
                                        <span className="text-gray-400">Total Revenue :</span>
                                        {/* Calc Total Revenue */}
                                        <span className="font-semibold text-primary text-sm">
                                            {e.bookedSeats?.reduce((acc, seat) => {
                                                const seatPrice = e.price?.[seat.row] || 0;
                                                return acc + Number(seatPrice);
                                            }, 0).toLocaleString()} EGP
                                        </span>
                                    </div>

                                    {/* Active Users Avatars */}
                                    <div className="flex items-center -space-x-2">
                                        {(() => {
                                            const usersActive = [];
                                            const seenIds = new Set();

                                            if (e.bookedSeats) {
                                                e.bookedSeats.forEach(seat => {
                                                    if (seat.userId && !seenIds.has(seat.userId)) {
                                                        seenIds.add(seat.userId);
                                                        usersActive.push({
                                                            id: seat.userId,
                                                            photo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                                                        });
                                                    }
                                                });
                                            }

                                            const displayLimit = 3;
                                            const displayedUsers = usersActive.slice(0, displayLimit);
                                            const remainingCount = usersActive.length - displayLimit;

                                            return (
                                                <>
                                                    {displayedUsers.map((user, idx) => (
                                                        <div key={user.id || idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden" title={user.id}>
                                                            <img
                                                                src={user.photo}
                                                                alt="User"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {remainingCount > 0 && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                            +{remainingCount}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>


                                <button
                                    onClick={() => navigate("/dashboard/manage-events", { state: { searchEvent: e.eventName } })}
                                    className="absolute bottom-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded-md shadow-md hover:bg-primary/80 transition"
                                >
                                    Manage Event
                                </button>






                                {/* {((e.date)) && (
                                    <div className="absolute bottom-2 left-2 flex gap-2 text-gray-500 text-xs bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                        <div className="flex flex-col">
                                            <span>{dayjs((e.date)?.toDate ? (e.date).toDate() : (e.date)).format("DD MMM YYYY")}</span>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (


                <NoEvent />
            )}
        </div>
    );
};

export default DayEvent;
