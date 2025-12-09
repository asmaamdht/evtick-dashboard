import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebare/Sidebar";
import Navbar from "../components/common/Navbar";

export default function Layout() {
    return (

        <div className="relative flex min-h-screen">

            {/* <div
                className="
                    absolute inset-0
                    bg-[url('src/assets/images/home-bg.jpg')] bg-cover bg-center bg-no-repeat
                    blur-xl
                "
            /> */}

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <main className="flex-1 flex flex-col ml-28 peer-hover:ml-[280px] p-6 transition-all duration-400 ease-in-out overflow-hidden
">
                    <Navbar />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
