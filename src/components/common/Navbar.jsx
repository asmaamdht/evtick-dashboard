import React from "react";
// import { AiOutlineSearch } from "react-icons/ai";
// import SearchInput from "./SearchInput";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.auth);


    // Add Page Title In Navbar By Using Location ::
    const location = useLocation();

    const path = location.pathname.split("/").filter(Boolean);

    const PageTitle =
        path.length > 0
            ? path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ")
            : "Dashboard";


    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between mb-5 rounded-xl bg-transparent">

            <h2 className="text-xl font-semibold text-gray-700">
                {PageTitle}
            </h2>

            {/* <div className="relative hidden md:block">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div> */}

            <div className="flex items-center gap-4">


                <div className="w-10 h-10 rounded-[10px] bg-white grid place-items-center overflow-hidden ">
                    <img
                        src={currentUser?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex items-center gap-3  border-white/20">

                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-gray-600">
                            {currentUser?.fullName || "Guest User"}
                        </p>

                    </div>

                </div>
            </div>
        </nav>
    );
}