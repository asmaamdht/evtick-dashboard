import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

export default function Sidebar() {
    return (
        <aside
            className="
        fixed top-6 left-6 bottom-7 w-20 
        rounded-[18px] z-50 transition-all duration-200 ease-in-out
        hover:w-[300px] group overflow-hidden components-sidebar peer"
        >
            <SidebarLeft />
            <SidebarRight />
        </aside>
    );
}
