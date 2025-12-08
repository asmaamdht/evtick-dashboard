import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, role, loading } = useSelector((state) => state.auth);

  // عرض loading screen بدل null
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/" replace />;

  if (requiredRole && role !== requiredRole) 
    return <Navigate to="/" replace />;

  return children;
}