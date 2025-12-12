import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // no user, login
  if (!user) return children;

  // If user exists but role missing → force login
  if (!user.role) return <Navigate to="/" replace />;

  // if rule  is organizer or admin
  if (user.role === "organizer") {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // If role not admin or organizer, login
  return <Navigate to="/" replace />;
}
