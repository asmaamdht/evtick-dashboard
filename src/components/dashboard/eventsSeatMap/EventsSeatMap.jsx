// EventsSeatMap.jsx
import React from "react";
import SeatMap from "./SeatMap";

export default function EventsSeatMap({ selectedEvent }) {
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const seatsPerRow = 12;

    const priceMap = selectedEvent?.price || {};

    const masterSeatMap = {};
    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            masterSeatMap[seatId] = null;
        }
    });

    let displaySeatMap = { ...masterSeatMap };
    let totalPrice = 0;

    if (selectedEvent) {
        const bookedSeats = selectedEvent.bookedSeats || [];
        const totalSeats = Object.keys(masterSeatMap).length;

        bookedSeats.forEach(s => {
            const seatId = `${s.row}${s.seat}`;
            displaySeatMap[seatId] = true;
            totalPrice += priceMap[s.row] || 0;
        });

        const unavailableSeatsCount = totalSeats - (selectedEvent.totalTickets || totalSeats);
        if (unavailableSeatsCount > 0) {
            Object.keys(displaySeatMap).reverse().forEach(seatId => {
                if (displaySeatMap[seatId] === null && unavailableSeatsCount > 0) {
                    displaySeatMap[seatId] = false;
                }
            });
        }
    }

    return <SeatMap seatMap={displaySeatMap} totalPrice={totalPrice} />;
}
