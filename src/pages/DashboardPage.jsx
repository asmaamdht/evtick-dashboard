import React, { useMemo } from "react";
import AnalyticsCards from "../components/dashboard/analyticsCards/AnalyticsCards";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizerEvents,
  getTotalRevenue,
  getTicketsSold,
  getActiveAttendance
} from "../redux/slices/analyticsSlice/analyticsThunks";
import DayEvents from "../components/dashboard/dayEvents/DayEvents";
import { fetchEventsByOrganizer } from "../redux/slices//eventSlice";
import { fetchOrganizerPayments } from "../redux/slices/paymentSlice";



function DashboardPage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { organizerPayments } = useSelector((state) => state.payment);

  const organizerUid = currentUser?.uid;
  const organizerName = currentUser?.fullName;


  // Fetch Analytics Data For Organizer
  useEffect(() => {
    if (organizerName && organizerUid) {
      dispatch(fetchOrganizerPayments(organizerName));
      dispatch(fetchEventsByOrganizer(organizerUid));
      dispatch(getOrganizerEvents(organizerUid));
      dispatch(getTotalRevenue(organizerUid));
      dispatch(getTicketsSold(organizerUid));
      dispatch(getActiveAttendance(organizerUid));
    }
  }, [dispatch, organizerName, organizerUid]);



  const activeAttendance = useMemo(() => {
    if (!organizerPayments) return 0;

    const uniqueUsers = new Set();

    organizerPayments.forEach(payment => {
      if (payment.userId) {
        uniqueUsers.add(payment.userId);
      }
    });

    return uniqueUsers.size;
  }, [organizerPayments]);

  const totalRevenue = useMemo(() => {
    return organizerPayments?.reduce((acc, payment) => {
      return acc + Number(payment.total || 0);
    }, 0);
  }, [organizerPayments]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <AnalyticsCards
          activeAttendance={activeAttendance}
          totalRevenue={totalRevenue}
        />
        <DayEvents />
      </div>

      <div className="flex-1 flex flex-col gap-6">
      </div>
    </div>
  );
}

export default DashboardPage;
