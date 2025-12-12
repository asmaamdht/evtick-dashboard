import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizerPayments } from "../redux/slices/paymentSlice";
import AttendanceCard from "../components/attendance/AttendanceCard";

export default function AttendancePage() {
  const dispatch = useDispatch();
  const { organizerPayments, loading } = useSelector((state) => state.payment);

  const organizer = useSelector((state) => state.auth.currentUser);
  const organizerName = organizer?.fullName;

  const [filterEvent, setFilterEvent] = useState("");
  const [filterRow, setFilterRow] = useState("");
  const [filterSeat, setFilterSeat] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);


  const cardsPerPage = 8;

  useEffect(() => {
    if (organizerName) {
      dispatch(fetchOrganizerPayments(organizerName));
    }
  }, [organizerName, dispatch]);

  // Filtering Logic
  const filteredPayments = organizerPayments?.filter((payment) => {
    if (filterEvent && !payment.eventName?.toLowerCase().includes(filterEvent.toLowerCase())) {
      return false;
    }

    if (filterRow || filterSeat) {
      const hasMatchingTicket = payment.tickets?.some(ticket => {
        const rowMatch = !filterRow || ticket.row?.toString().toLowerCase() === filterRow.toLowerCase();
        const seatMatch = !filterSeat || ticket.seat?.toString().toLowerCase() === filterSeat.toLowerCase();
        return rowMatch && seatMatch;
      });

      if (!hasMatchingTicket) return false;
    }

    if (filterDate) {
      const paymentDate = payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : "";
      if (paymentDate !== filterDate) {
        return false;
      }
    }

    return true;
  });

  // Pagination Logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredPayments.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(filteredPayments.length / cardsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Attendance & Payments</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">

        {/* Event Name Filter */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px] ">
          <label className="text-sm font-medium text-slate-600">Event Name</label>
          <input
            type="text"
            placeholder="Search event..."
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-[#F4F7FA] focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386]"
          />
        </div>

        {/* Row Filter */}
        <div className="flex flex-col gap-1 w-24">
          <label className="text-sm font-medium text-slate-600">Row</label>
          <input
            type="text"
            placeholder="Ex: A"
            value={filterRow}
            onChange={(e) => setFilterRow(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-[#F4F7FA] focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386]"
          />
        </div>

        {/* Seat Filter */}
        <div className="flex flex-col gap-1 w-24">
          <label className="text-sm font-medium text-slate-600">Seat</label>
          <input
            type="text"
            placeholder="Ex: 5"
            value={filterSeat}
            onChange={(e) => setFilterSeat(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-[#F4F7FA] focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386]"
          />
        </div>

        {/* Date Filter */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-600">Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-400 focus:text-black border border-slate-300 bg-[#F4F7FA] focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386]"
          />
        </div>

        {/* Reset Button */}
        {(filterEvent || filterRow || filterSeat || filterDate) && (
          <button
            onClick={() => {
              setFilterEvent("");
              setFilterRow("");
              setFilterSeat("");
              setFilterDate("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 mb-[1px] text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {(!filteredPayments || filteredPayments.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-gray-400">
          <p className="text-lg font-semibold">No attendance records found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCards.map((payment) => (
              <AttendanceCard key={payment.id} payment={payment} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-200 disabled:opacity-50 rounded-lg"
              >
                Prev
              </button>

              <span className="font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-200 disabled:opacity-50 rounded-lg"
              >
                Next
              </button>
            </div >
          )
          }
        </>
      )}
    </div >
  );
}
