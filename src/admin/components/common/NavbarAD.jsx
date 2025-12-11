import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import SearchInput from "./SearchInputAD";
import { useSelector } from "react-redux"; 

export default function NavbarAD() {
    const { currentUser } = useSelector((state) => state.auth);

    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between mb-5 rounded-xl bg-transparent">
            <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div>

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