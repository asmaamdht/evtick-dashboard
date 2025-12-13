import { Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import DashboardPage from "../pages/DashboardPage";
import SettingPage from "../pages/SettingPage";
import CreateEventPage from "../pages/CreateEventPage";
import ManageEventPage from "../pages/ManageEventPage";
import ChatPage from "../pages/ChatPage";
import AttendancePage from "../pages/AttendancePage";
import TicketsPage from "../pages/TicketsPage";
import AnalysizePage from "../pages/AnalysizePage";
import Login from "../auth/login/Login";
import AuthLayout from "../auth/components/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../auth/password/ResetPassword";
import ForgetPassword from "../auth/password/ForgotPassword";
import GuestRoute from "../auth/components/GuestRoute";
import StreamPage from "../pages/StreamPage";
import DashboardPageAD from "../admin/pages/DashboardPageAD";
import AnalysizePageAD from "../admin/pages/AnalysizePageAD";
import AttendancePageAD from "../admin/pages/AttendancePageAD";
import ContactUsAD from "../admin/pages/ContactUsAD";
import ChatPageAD from "../admin/pages/ChatPageAD";
import EventRequestsPageAD from "../admin/pages/EventRequestsPageAD";
import ManageEventPageAD from "../admin/pages/ManageEventPageAD";
import UsersPageAD from "../admin/pages/UsersPageAD";
import AdminLayout from "../admin/Layout/AdminLayout";
import ProfileAD from "../admin/components/setting/ProfileAD";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH LAYOUT */}
      <Route element={<AuthLayout />}>
        <Route
          index
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <GuestRoute>
              <ForgetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
      </Route>

      {/* Organizer LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="settings" element={<SettingPage />} />
        <Route path="create-event/:eventId?" element={<CreateEventPage />} />
        <Route path="manage-events" element={<ManageEventPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="analysize" element={<AnalysizePage />} />
        <Route path="stream" element={<StreamPage />} />
      </Route>


      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPageAD />} />
        <Route path="analysize" element={<AnalysizePageAD />} />
        <Route path="attendance" element={<AttendancePageAD />} />
        <Route path="contactUs" element={<ContactUsAD />} />
        <Route path="chat" element={<ChatPageAD />} />
        <Route path="event-requests" element={<EventRequestsPageAD />} />
        <Route path="manage-events" element={<ManageEventPageAD />} />
        <Route path="users" element={<UsersPageAD />} />
        <Route path="profile" element={<ProfileAD />} />
      </Route>

    </Routes>
  );
}
