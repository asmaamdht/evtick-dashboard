import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, role, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  //no user, login
  if (!currentUser) return <Navigate to="/" replace />;

  // check role
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    
  
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "organizer") return <Navigate to="/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return children;
}
