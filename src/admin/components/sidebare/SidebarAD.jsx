import SidebarLeftAD from "./SidebarLeftAD";
import SidebarRightAD from "./SidebarRightAD";

export default function SidebarAD() {
    return (
        <aside
            className="
        fixed top-6 left-6 bottom-7 w-20 
        rounded-[18px] z-50 transition-all duration-400 ease-in-out
        hover:w-[300px] group overflow-hidden components-sidebar peer"
        >
            <SidebarLeftAD />
            <SidebarRightAD />
        </aside>
    );
}
