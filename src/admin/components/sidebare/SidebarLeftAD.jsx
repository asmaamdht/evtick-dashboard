import { AiFillHome, AiFillSetting, AiOutlineUser } from "react-icons/ai";
import { BsChatDotsFill, BsBoxArrowRight } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import LogoutButtonAD from "./LogoutButtonAD";

export default function SidebarLeftAD() {
    return (
        <div
            className="
                absolute top-0 bottom-0 left-0 w-16 
                bg-[#100C08]/90
                flex flex-col items-center py-6
                transition-all duration-400 z-10
                rounded-[18px] group-hover:rounded-r-none"
        >
            <div className="w-9 h-9 mb-10 flex items-center justify-center  text-white text-xl">
                <FaBars />
            </div>
            <LeftButton to="/admin" icon={<AiFillHome />} />
            <LeftButton to="chat" icon={<BsChatDotsFill />} />
            <LeftButton to="users" icon={<AiOutlineUser />} />

            <div className="mt-auto mb-2">
                <LogoutButtonAD />
            </div>
        </div>
    );
}

function LeftButton({ to, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
            w-9 h-9 grid place-items-center rounded-lg mb-6 text-xl transition duration-300
            ${isActive
                    ? "bg-gradient-to-br from-[#0f9386] to-[#0f9386] text-white"
                    : "bg-[#353839] text-[#F2F3F4] hover:text-white"}
            `}
        >
            {icon}
        </NavLink>
    );
}
