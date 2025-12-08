import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizerPayments } from "../redux/slices/paymentSlice";
import AttendanceCard from "../components/attendance/AttendanceCard";

export default function AttendancePage() {
  const dispatch = useDispatch();
  const { organizerPayments, loading } = useSelector((state) => state.payment);
  
  // جلب الـ Organizer من Redux authSlice
  const organizer = useSelector((state) => state.auth.currentUser);
  const organizerName = organizer?.fullName;

  

  useEffect(() => {
    if (organizerName) {
      dispatch(fetchOrganizerPayments(organizerName));
    }
  }, [organizerName, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!organizerPayments || organizerPayments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-500 text-lg font-semibold">
        No visitors yet
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizerPayments.map((payment) => (
        <AttendanceCard key={payment.id} payment={payment} />
      ))}
    </div>
  );
}
