import React from "react";
import AnalyticsCards from "../components/dashboard/analyticsCards/AnalyticsCards";
import DailyEvents from "../components/dashboard/DailyEvents/DailyEvents";
import EventsSeatMap from "../components/dashboard/eventsSeatMap/EventsSeatMap";



import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizerEvents,
  getTotalRevenue,
  getTicketsSold,
  getActiveAttendance
} from "../redux/slices/analyticsCardSlice/analyticsCardThunks";

function DashboardPage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const user = currentUser || JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.uid) {
      dispatch(getOrganizerEvents(user.uid));
      dispatch(getTotalRevenue(user.uid));
      dispatch(getTicketsSold(user.uid));
      dispatch(getActiveAttendance(user.uid));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <AnalyticsCards />
        <DailyEvents />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <EventsSeatMap />
      </div>
    </div>
  );
}

export default DashboardPage;
