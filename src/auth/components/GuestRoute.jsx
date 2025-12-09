import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  //if user in local, no login/register
   if (user) {
    return <Navigate to="/dashboard" replace />; 
  }

  return children;
}
