import React from "react";
import SmallSeatMap from "./SmallSeatMap";

export default function SmallData({ selectedEvent }) {
 

  const leftRows = [1, 2, 3, 4, 5];
  const centerRows = [1, 2, 3, 4, 5, 6];
  const rightRows = [1, 2, 3, 4, 5];

  const seatsPerLeftRow = 4;
  const seatsPerCenterRow = 10;
  const seatsPerRightRow = 4;

  const priceMap = selectedEvent?.price || {};
  const theaterSeatMap = {};

  // Helper to init seats
  const initSeats = (rows, countPer, prefix = "") => {
    let globalCounter = 1;
    rows.forEach(row => {
      for (let i = 1; i <= countPer; i++) {
        const seatId = `${prefix}${globalCounter}`;
        theaterSeatMap[seatId] = null;
        globalCounter++;
      }
    });
  };

  initSeats(leftRows, seatsPerLeftRow, "L");
  initSeats(centerRows, seatsPerCenterRow, "C");
  initSeats(rightRows, seatsPerRightRow, "R");

  let displaySeatMap = { ...theaterSeatMap };
  let totalPrice = 0;

  if (selectedEvent) {
    const bookedSeats = selectedEvent.bookedSeats || [];
    const totalSeats = Object.keys(theaterSeatMap).length;

    bookedSeats.forEach(s => {
      const seatId = `${s.row}${s.seat}`;
      if (displaySeatMap.hasOwnProperty(seatId)) {
        displaySeatMap[seatId] = true;
        totalPrice += priceMap[s.row] || 0; // Simplified price logic
      }
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

  return (
    <SmallSeatMap
      seatMap={displaySeatMap}
      totalPrice={totalPrice}
      config={{
        left: { rows: leftRows, seats: seatsPerLeftRow, prefix: "L" },
        center: { rows: centerRows, seats: seatsPerCenterRow, prefix: "C" },
        right: { rows: rightRows, seats: seatsPerRightRow, prefix: "R" }
      }}
    />
  );
}