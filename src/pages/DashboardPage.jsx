import React from "react";
import CustomEvents from "../components/dashboard/CustomEvents";
import AnalyticsCards from "../components/dashboard/AnalyticsCards";



function DashboardPage() {
  return (
    <div className="flex justify-between">

      <div>
        <AnalyticsCards />
      </div>

      <CustomEvents />
    </div>
  );
}

export default DashboardPage;
