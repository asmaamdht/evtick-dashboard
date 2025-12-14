import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebare/Sidebar";
import Navbar from "../components/common/Navbar";

export default function Layout() {
    return (

        <div className="relative flex min-h-screen">


            <div className="absolute inset-0 bg-[#F4F7FA]" />

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <main className="flex-1 flex flex-col ml-28 lg:peer-hover:ml-[280px] transition-all duration-400 ease-in-out h-screen overflow-hidden py-6 pr-6">
                    <Navbar />
                    <div className="flex-1 overflow-auto scrollbar-hide">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
