
import React from "react";
import LargeSeatMap from "./LargeSeatMap";

export default function LargeData({ selectedEvent }) {
    // Config for circular tables
    // 12 tables distributed evenly in arcs
    const tables = [
        // Top Row (Arc)
        { id: 1, seats: 5, x: 70, y: 50 },
        { id: 2, seats: 5, x: 270, y: 20 },
        { id: 3, seats: 5, x: 470, y: 10 },
        { id: 4, seats: 5, x: 670, y: 20 },
        { id: 5, seats: 5, x: 870, y: 50 },

        // Middle Row
        { id: 6, seats: 5, x: 170, y: 200 },
        { id: 7, seats: 5, x: 370, y: 180 },
        { id: 8, seats: 5, x: 570, y: 180 },
        { id: 9, seats: 5, x: 770, y: 200 },

        // Bottom Row
        { id: 10, seats: 5, x: 270, y: 350 },
        { id: 11, seats: 5, x: 470, y: 320 },
        { id: 12, seats: 5, x: 670, y: 350 },
    ];

    const priceMap = selectedEvent?.price || {};
    const theaterSeatMap = {};

    // Init seats
    tables.forEach(table => {
        for (let i = 1; i <= table.seats; i++) {
            const seatId = `T${table.id} -S${i} `;
            theaterSeatMap[seatId] = null;
        }
    });

    let displaySeatMap = { ...theaterSeatMap };
    let totalPrice = 0;

    if (selectedEvent) {
        const bookedSeats = selectedEvent.bookedSeats || [];

        bookedSeats.forEach(s => {
            const seatId = `T${s.table} -S${s.seat} `; // Assuming booking data has 'table' and 'seat' prop, or we map row->table
            // If the data structure uses 'row' as table ID, we can adapt:
            // const seatId = `T${ s.row } -S${ s.seat } `;

            if (displaySeatMap.hasOwnProperty(seatId)) {
                displaySeatMap[seatId] = true;
                totalPrice += priceMap[s.row] || 0;
            }
        });

        // Handle unavailable/capacity logic if needed similar to other maps
    }

    return (
        <LargeSeatMap
            seatMap={displaySeatMap}
            totalPrice={totalPrice}
            config={tables}
        />
    );
}
