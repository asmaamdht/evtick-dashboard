import { Outlet } from "react-router-dom";
import SidebarAD from "../components/sidebare/SidebarAD";
import NavbarAD from "../components/common/NavbarAD";


export default function AdminLayout() {
    return (

        <div className="relative flex min-h-screen">

            {/* <div
                className="
                    absolute inset-0
                    bg-[url('src/assets/images/home-bg.jpg')] bg-cover bg-center bg-no-repeat
                    blur-xl
                "
            /> */}

            <div className="absolute inset-0 bg-[#F4F7FA]" />

            <div className="relative z-10 flex w-full">
                <SidebarAD />
                <main className="flex-1 flex flex-col ml-28 peer-hover:ml-[280px] p-6 transition-all duration-400 ease-in-out overflow-hidden">
                    <NavbarAD />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
