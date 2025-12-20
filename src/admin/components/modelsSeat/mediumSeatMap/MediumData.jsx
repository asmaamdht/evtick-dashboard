import React from "react";
import MediumSeatMap from "./MediumSeatMap";

export default function MediumData({ selectedEvent }) {
    const seatMapData = {};
    let totalPrice = 0;

    if (selectedEvent?.seats) {
        selectedEvent.seats.forEach(seat => {
            seatMapData[seat.id] = null;
        });

        const bookedSeats = selectedEvent.bookedSeats || [];
        bookedSeats.forEach(s => {
            const seatId = `${s.row}${s.seat}`;
            if (Object.prototype.hasOwnProperty.call(seatMapData, seatId)) {
                seatMapData[seatId] = true;
                totalPrice += selectedEvent.price?.[s.row] || 0;
            }
        });

        const totalSeats = selectedEvent.seats.length;
        const unavailableSeatsCount = totalSeats - (selectedEvent.totalTickets || totalSeats);
        if (unavailableSeatsCount > 0) {
            Object.keys(seatMapData).reverse().forEach(seatId => {
                if (seatMapData[seatId] === null && unavailableSeatsCount > 0) {
                    seatMapData[seatId] = false;
                }
            });
        }
    }

    return <MediumSeatMap seatMap={seatMapData} totalPrice={totalPrice} />;
}
