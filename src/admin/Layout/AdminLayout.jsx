import { Outlet } from "react-router-dom";
import SidebarAD from "../components/sidebare/SidebarAD";
import NavbarAD from "../components/common/NavbarAD";


export default function AdminLayout() {
    return (

        <div className="relative flex min-h-screen">



            <div className="absolute inset-0 bg-[#F4F7FA]" />

            <div className="relative z-10 flex w-full">
                <SidebarAD />

                <main className="flex-1 flex flex-col ml-28 lg:peer-hover:ml-[280px] transition-all duration-400 ease-in-out h-screen overflow-hidden py-6 pr-6">
                    <NavbarAD />
                    <div className="flex-1 overflow-auto scrollbar-hide bg-white rounded-xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
