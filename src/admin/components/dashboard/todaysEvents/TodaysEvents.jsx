import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAllEvents } from "../../../../redux/slices/eventSlice";
import dayjs from "dayjs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { fetchAllPayments } from "../../../../redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";

function TodaysEvents({ selectedDate }) {
    const events = useSelector((state) => state.events.events);
    const dispatch = useDispatch();
    const { allPayments } = useSelector((state) => state.payment);
    const navigate = useNavigate();




    useEffect(() => {
        dispatch(fetchAllEvents());
        dispatch(fetchAllPayments());
    }, [dispatch]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEvents = events.filter(event => {
        if (!event.createdAt || !event.date) return false;

        const createdAt = event.createdAt.toDate();
        const endDate = event.date.toDate();
        createdAt.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        if (selectedDate) {
            // selected Date 
            const selected = new Date(selectedDate);
            selected.setHours(0, 0, 0, 0);

            // Check if items are on the same day
            const eventDay = event.date.toDate();
            eventDay.setHours(0, 0, 0, 0);

            return selected.getTime() === eventDay.getTime();
        }


        // All Events From Today To EndDate ::

        return today >= createdAt && today <= endDate;
    });

    // Sort Events By Date From Olde To Newe :: 

    const sortedEvents = filteredEvents.sort((a, b) => {
        const dateA = a.date?.toDate?.() || new Date(0);
        const dateB = b.date?.toDate?.() || new Date(0);
        return dateA - dateB;
    });

    // Calculate Profit ::

    const Commission = 0.05;

    const getEventProfit = (event) => {
        let profit = 0;

        if (allPayments && allPayments.length > 0) {
            const eventPayments = allPayments.filter(p => p.eventId === event.id);

            profit = eventPayments.reduce((sum, payment) => {
                return sum + (Number(payment.serviceFee) || 0);
            }, 0);
        }

        // Fallback or additional logic if needed, but user specifically asked for payment collection serviceFee
        if (profit === 0 && event.bookedSeats && event.bookedSeats.length > 0 && event.price) {
            profit = event.bookedSeats.reduce((sum, seat) => {
                const seatPrice = event.price[seat.row] || 0;
                return sum + seatPrice * Commission;
            }, 0);
        }

        return profit;
    };

    const totalProfit = filteredEvents.reduce(
        (sum, event) => sum + getEventProfit(event),
        0
    );




    return (
        <div className="relative flex flex-col gap-4 h-full bg-gray-100 pt-2 rounded-xl ">
            {/* Events Cards */}
            <div className="flex flex-col gap-4 px-2 max-h-[490px] overflow-y-auto flex-1 scrollbar-hide">
                {sortedEvents.map((event) => {
                    const profit = getEventProfit(event);

                    return (
                        <div
                            key={event.id}
                            onClick={() => navigate("/admin/manage-events", { state: { searchEventsADPage: event.eventName } })}

                            className="flex flex-col p-3 rounded-xl bg-white shadow-sm"
                        >
                            <div className="flex gap-4 items-center">
                                <img
                                    src={event.photo}
                                    alt={event.eventName}
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                />

                                <div className="flex flex-col flex-1 ">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold text-gray-600">
                                            {event.eventName.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                        </h3>

                                        <span className="text-xs font-bold text-gray-600  bg-gray-100 px-2 py-2 rounded-lg">
                                            PlatformFee : 5%
                                        </span>
                                    </div>
                                    <p className="flex items-center gap-1 text-sm text-gray-400">
                                        <AiOutlineClockCircle className="text-primary" />
                                        {event.date ? dayjs(event.date.toDate()).format("DD/MM/YYYY HH:mm") : ""}
                                    </p>


                                    <div className="flex gap-6 text-sm text-gray-600 items-center">
                                        <div className="flex gap-3">
                                            <p>
                                                TicketsSold:
                                                <span className="font-semibold text-gray-800 ml-1">
                                                    {event.ticketsSold}
                                                </span>
                                            </p>

                                            <p>
                                                TotalTickets:
                                                <span className="font-semibold text-gray-800 ml-1">
                                                    {event.totalTickets - event.ticketsSold}
                                                </span>
                                            </p>
                                        </div>

                                        <p className="ml-auto font-semibold text-green-700">
                                            {profit.toLocaleString()}EGP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Profit Box */}
            <div className="
                absolute bottom-0 left-0 right-0
                py-4 px-4
                flex justify-between text-sm font-semibold
                bg-white
                rounded-tl-lg rounded-tr-lg
                shadow-[0_-6px_16px_rgba(0,0,0,0.12)]
                ">
                <p className='text-gray-500'>
                    Number of Events:
                    <span className="ml-1 text-gray-900">
                        {filteredEvents.length}
                    </span>
                </p>

                <p className="text-gray-600">
                    Total Profit:
                    <span className="ml-1 text-primary">
                        {totalProfit.toLocaleString()} EGP
                    </span>
                </p>
            </div>
        </div >
    );
}

export default TodaysEvents;