import {
    AiOutlineDashboard,
    AiOutlineTeam,
    AiOutlineCreditCard,
    AiOutlineCalendar,
    AiOutlineBarChart,
    AiOutlinePullRequest,
    AiFillContacts

} from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { MdEventSeat } from "react-icons/md";


import { NavLink } from "react-router-dom";

export default function SidebarRightAD() {
    return (
        <div
            className="
        absolute top-0 bottom-0 left-16 w-[180px] bg-[#353839]
        -translate-x-full group-hover:translate-x-0
        transition-all duration-400 ease-in-out py-6 flex flex-col
        rounded-[18px] group-hover:rounded-l-none
    "
        >
            <h1 className="text-white text-xl font-medium mb-6 ml-7 tracking-wide">
                EvTick
            </h1>

            <div className="px-4 grid grid-cols-2 gap-4">
                <SidebarButton to="event-requests" icon={<AiOutlinePullRequest />} label="Event Requests" />
                <SidebarButton to="manage-events" icon={<AiOutlineCalendar />} label="Manage Events" />
                <SidebarButton to="analysize" icon={<AiOutlineBarChart />} label="analysize" />
                <SidebarButton to="attendance" icon={<AiOutlineTeam />} label="Visitors" />
                <SidebarButton to="modelsSeat" icon={<MdEventSeat />} label="Models Seat" />
                <SidebarButton to="contactUs" icon={<AiFillContacts />} label="Contact Us" />
                <SidebarButton to="chatRoom" icon={<BsChatDotsFill />} label="Chat" />
            </div>


        </div>
    );
}

function SidebarButton({ icon, label, to }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
            flex flex-col items-center gap-2 p-2
            transition duration-300
            ${isActive ? "text-white" : "text-[#F2F3F4] hover:text-white"}
    `}
        >
            {({ isActive }) => (
                <>
                    <div
                        className={`
                w-10 h-10 grid place-items-center
                rounded-lg text-xl transition duration-300
                ${isActive
                                ? "bg-gradient-to-br from-[#0f9386] to-[#0f9386]"
                                : "bg-[#91A3B0] hover:bg-gradient-to-br hover:from-[#0f9386] hover:to-[#0f9386]"}
            `}
                    >
                        {icon}
                    </div>
                    <span className="text-xs text-center">{label}</span>
                </>
            )}
        </NavLink>
    );
}
