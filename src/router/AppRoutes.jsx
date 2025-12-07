import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import DashboardPage from "../pages/DashboardPage";
import SettingPage from "../pages/SettingPage";
import CreateEventPage from "../pages/CreateEventPage";
import ManageEventPage from "../pages/ManageEventPage";
import ChatPage from "../pages/ChatPage";
import AttendancePage from "../pages/AttendancePage";
import TicketsPage from "../pages/TicketsPage";
import AnalysizePage from "../pages/AnalysizePage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "chat",
                element: <ChatPage />,
            },
            {
                path: "settings",
                element: <SettingPage />,
            },
            {
                path: "create-event",
                element: <CreateEventPage />,
            },
            {
                path: "manage-events",
                element: <ManageEventPage />,
            },
            {
                path: "attendance",
                element: <AttendancePage />,
            },
            {
                path: "tickets",
                element: <TicketsPage />,
            },
            {
                path: "analysize",
                element: <AnalysizePage />,
            },

        ],
    },
]);

export default router;
