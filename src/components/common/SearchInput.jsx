import { AiOutlineSearch } from "react-icons/ai";

export default function SearchInput({ placeholder = "Search...", width = "w-[350px]" }) {
    return (
        <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
            <input
                type="text"
                placeholder={placeholder}
                className={`bg-white placeholder-gray rounded-[10px] pl-10 pr-4 py-2 focus:outline-none focus:ring-0 ${width} transition-all`}
            />
        </div>
    );
}