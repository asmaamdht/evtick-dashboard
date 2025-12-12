import React from "react";
import dayjs from "dayjs";

import { AiOutlineEnvironment } from "react-icons/ai";

import { useNavigate } from "react-router-dom";
import NoEventsCard from "./NoEventsCard";



const DayEvents = ({ events = [], selectedDate }) => {
    const navigate = useNavigate();

    const dayEvents = events.filter(e => {
        const dateField = e.date || e.eventDate;
        if (!dateField) return false;

        const eventDate = dateField.toDate ? dayjs(dateField.toDate()) : dayjs(dateField);

        return eventDate.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
    }).sort((a, b) => {
        // Sort Events By Time 
        if (a.time && b.time) {

            const timeA = dayjs(`2000-01-01 ${a.time.split('-')[0]}`);
            const timeB = dayjs(`2000-01-01 ${b.time.split('-')[0]}`);
            return timeA.diff(timeB);
        }
        return 0;
    }).slice(0, 1);

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

                                    {e.createdAt && (
                                        <span className="absolute top-2 left-2 bg-black/50 text-white text-[11px] px-2 py-1 rounded-md backdrop-blur-sm">
                                            {dayjs(e.createdAt.toDate()).format("MMMM DD, YYYY • hh:mm A")}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-1 px-3">


                                <div className="flex justify-between">
                                    <div className="font-semibold text-lg pt-2">{e.title || e.eventName}</div>

                                    {e.totalTickets && (
                                        <div className="flex items-center gap-1 text-textColor text-xs pt-1">
                                            <p ><span className="font-semibold text-2xl">{e.totalTickets}</span> Tickets</p>
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
                                    <div className="text-gray-600 text-sm">
                                        {e.description}
                                    </div>
                                )}



                                <button
                                    onClick={() => navigate("/dashboard/manage-events")}
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


                <NoEventsCard />
            )}
        </div>
    );
};

export default DayEvents;
