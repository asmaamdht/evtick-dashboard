import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import SearchInput from "./SearchInputAD";
import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom"; 

export default function NavbarAD() {
    const { currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate(); 

    return (
        <nav className="sticky top-5  z-40 w-full flex items-center justify-between mb-5 rounded-xl bg-transparent">
            
            {/* Search Bar */}
            <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
                
                <div 
                    className="flex items-center mx-5 gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => navigate("/admin/profile")} 
                >
                    
                    <div className="w-12 h-12 rounded-[10px] bg-white grid place-items-center overflow-hidden border border-gray-200">
                        <img 
                            src={currentUser?.profilePic || "https://cdn-icons-png.flaticon.com/512/2206/2206368.png"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-right hidden md:block">
                        <p className="text-md  font-bold text-gray-700">
                            {currentUser?.fullName || "Admin User"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {currentUser?.role || "Admin"}
                        </p>
                    </div>

                </div>
            </div>
        </nav>
    );
}