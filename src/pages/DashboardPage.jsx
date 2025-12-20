import React, { useMemo, useState } from "react";
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
import SeatMap from "../components/dashboard/SeatMap";
import { fetchEventsByOrganizer } from "../redux/slices//eventSlice";
import { fetchOrganizerPayments } from "../redux/slices/paymentSlice";
import dayjs from "dayjs";


function DashboardPage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { organizerPayments } = useSelector((state) => state.payment);
  const { events } = useSelector((state) => state.events);

  const [selectedDate, setSelectedDate] = useState(dayjs());


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

  // Derive the event displayed for the selected date
  const displayedEvent = useMemo(() => {
    if (!events || !selectedDate) return null;
    return events
      .filter(e => {
        const dateField = e.date;
        if (!dateField) return false;
        const eventDate = dayjs(e.date);
        return eventDate.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
      })
      .sort((a, b) => {
        if (a.time && b.time) {
          const timeA = dayjs(`2000-01-01 ${a.time.split('-')[0]}`);
          const timeB = dayjs(`2000-01-01 ${b.time.split('-')[0]}`);
          return timeA.diff(timeB);
        }
        return 0;
      })
      .slice(0, 1)[0];
  }, [events, selectedDate]);


  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <AnalyticsCards
          activeAttendance={activeAttendance}
          totalRevenue={totalRevenue}
        />
        <DayEvents selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <SeatMap event={displayedEvent} />
      </div>
    </div>
  );
}

export default DashboardPage;
