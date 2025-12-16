import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import SearchInput from "./SearchInputAD";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function NavbarAD() {
    const { currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();



    // Add Page Title In Navbar By Using Location ::
    const location = useLocation();

    const path = location.pathname.split("/").filter(Boolean);

    const PageTitle =
        path.length > 0
            ? path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ")
            : "Dashboard";


    return (
        <nav className="sticky  z-40 w-full flex items-center justify-between mb-5 rounded-xl bg-white pl-4 py-1">

            {/* Search Bar */}
            {/* <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div> */}

            {/* Page Title */}

            <h2 className="text-xl font-semibold text-gray-700">
                {PageTitle}
            </h2>

            {/* Profile Section */}
            <div className="flex items-center gap-4">

                <div
                    className="flex items-center mx-5 gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => navigate("/admin/profile")}
                >
                    <div className="text-right hidden md:block">
                        <p className="text-md  font-bold text-gray-700">
                            {currentUser?.fullName || "Admin User"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {currentUser?.role || "Admin"}
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-[10px] bg-white grid place-items-center overflow-hidden border border-gray-200">
                        <img
                            src={currentUser?.profilePic || "https://cdn-icons-png.flaticon.com/512/2206/2206368.png"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>



                </div>
            </div>
        </nav>
    );
}