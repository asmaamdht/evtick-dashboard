import React from "react";
import Avatar from "../../common/Avatar";
import { useSelector } from "react-redux";

function MostActiveOrganizer() {

    const events = useSelector((state) => state.events.events);

    const organizerMap = {};
    events.forEach((event) => {
        const name = event.eventOwner || "Organizer";
        const uid = event.organizerUid || name;
        if (!organizerMap[uid]) {
            organizerMap[uid] = { name, eventsAdded: 0, uid };
        }
        organizerMap[uid].eventsAdded += 1;
    });

    const activeOrganizers = Object.values(organizerMap)
        .sort((a, b) => b.eventsAdded - a.eventsAdded)
        .slice(0, 10);

    return (
        <div >
            <h3 className="text-lg font-semibold mb-4">Most Active Organizers</h3>
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto scrollbar-hide">
                {activeOrganizers.map((user, index) => {

                    return (
                        <li
                            key={index}
                            className="flex items-center justify-between bg-gray-100 rounded-lg p-2"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar />

                                <span>{user.name}</span>
                            </div>
                            <span className="text-sm text-gray-600 pr-3">
                                {user.eventsAdded} Events
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default MostActiveOrganizer;
