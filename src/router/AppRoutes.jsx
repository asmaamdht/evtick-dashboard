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
import DashboardLayout from "../layouts/DashboardLayout";



export default function AppRoutes() {
  return (
       <Routes>

        {/* AUTH LAYOUT */}
        <Route element={<AuthLayout />}>
          <Route index element={
          <GuestRoute>
            <Login /> 
            </GuestRoute>
            } />
          <Route path="forgot-password" element={
            <GuestRoute>
            <ForgetPassword />
            </GuestRoute>
            } />
          <Route path="reset-password" element={
            <GuestRoute>
            <ResetPassword />
            </GuestRoute>
            } />
        </Route>

        {/* DASHBOARD LAYOUT */}
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
        </Route>

      </Routes>
  )
}
