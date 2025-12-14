// EventsSeatMap.jsx
import React from "react";
import MediumSeatMap from "./MediumSeatMap";

export default function MediumData({ selectedEvent }) {
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const seatsPerRow = 12;

    const priceMap = selectedEvent?.price || {};

    const theaterSeatMap = {};
    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            theaterSeatMap[seatId] = null;
        }
    });

    let displaySeatMap = { ...theaterSeatMap };
    let totalPrice = 0;

    if (selectedEvent) {
        const bookedSeats = selectedEvent.bookedSeats || [];
        const totalSeats = Object.keys(theaterSeatMap).length;

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

    return <MediumSeatMap seatMap={displaySeatMap} totalPrice={totalPrice} />;
}
