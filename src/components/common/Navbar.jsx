import { AiOutlineSearch } from "react-icons/ai";
import SearchInput from "./SearchInput";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between  mb-5 rounded-xl">
            <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div>

            <div className="flex items-center gap-4">


                <div className="flex items-center gap-3 pl-4  border-white/20">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-[#696969]">Asmaa Medhat</p>
                    </div>
                    <div className="w-10 h-10 rounded-[10px] bg-white grid place-items-center text-white font-bold">

                    </div>
                </div>
            </div>
        </nav>
    );
}
