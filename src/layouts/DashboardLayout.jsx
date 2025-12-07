import Sidebar from "../components/sidebare/Sidebar";


export default function DashboardLayout({ children }) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-[100px] p-10 w-full">
                {children}
            </main>
        </div>
    );
}
