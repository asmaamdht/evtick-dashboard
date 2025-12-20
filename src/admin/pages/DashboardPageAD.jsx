import React, { useEffect, useState } from "react";
import AnalyticsCardAD from "../components/dashboard/analyticsCardAD/AnalyticsCardAD";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEventsAD,
  getTotalRevenueAD,
  getTicketsSoldAD,
  getActiveAttendanceAD,
  getAnalyticsChartDataAD
} from "../../redux/slices/analyticsSliceAD/analyticsThunksAD";
import SpecialOfferCard from "../components/dashboard/SpecialOfferCard";
import MostActiveOrganizer from "../components/dashboard/userActiveAD/MostActiveOrganizer";
import { fetchAllEvents } from "../../redux/slices/eventSlice";
import TodaysEvents from "../components/dashboard/todaysEvents/TodaysEvents";
import EventCalendar from "../components/dashboard/todaysEvents/EventCalendar";
import TopEventsProfitChart from "../components/dashboard/todaysEvents/TopEventsProfitChart";
function DashboardPageAD() {

  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const events = useSelector((state) => state.events.items);

  useEffect(() => {
    dispatch(getAllEventsAD());
    dispatch(getTotalRevenueAD());
    dispatch(getTicketsSoldAD());
    dispatch(getActiveAttendanceAD());
    dispatch(getAnalyticsChartDataAD());

    dispatch(fetchAllEvents());

  }, [dispatch]);


  return (
    <div className="p-2 flex flex-col lg:flex-row gap-6">

      {/* Analytisc Card */}
      <div className="flex flex-col gap-4 flex-shrink-0 w-full lg:w-[620px] ">
        <AnalyticsCardAD />

        {/* Event Calendar & Chart Top Events Profit */}
        <div className="flex flex-col md:flex-row gap-4 ">
          <div className="flex-1">
            <TopEventsProfitChart />
          </div>

          <div className="flex-1 md:flex-[1.2]">
            <EventCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={events}
            />
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-6 flex-[1] ">
        <TodaysEvents selectedDate={selectedDate} />
      </div>

      <div className="flex flex-col gap-6 pr-2 rounded-xl fle-[1] flex-shrink-0  ">
        <SpecialOfferCard
          image="src/assets/images/personAd.png"
          title="Event Highlight"
          subtitle="Check This Events"
          buttonText="Manage Event"
          bgColor="bg-second"
        />

        <MostActiveOrganizer />
      </div>
    </div>
  )
}

export default DashboardPageAD;