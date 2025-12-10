import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";

export default function AttendanceCard({ payment }) {
  const [showModal, setShowModal] = useState(false);

  const fullName = payment.userInfo
    ? `${payment.userInfo.firstName} ${payment.userInfo.lastName}`
    : payment.fullName;

  const firstLetter = fullName?.charAt(0).toUpperCase();
  const tickets = payment.tickets || [];

  
  const visibleTickets = tickets.slice(0, 1);

  return (
    <>
      {/* ===== CARD ===== */}
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border w:[100%] md:w-[100%] h-auto transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(13,148,136,0.6)] ">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {firstLetter}
          </div>
          <div>
            <h3 className="font-bold text-lg text-black">{fullName}</h3>
            <p className="text-sm text-gray-600">{payment.eventName.split(" ").slice(0,3)}</p>
          </div>
        </div>

        {/* Tickets Section */}
      <div className="flex flex-col justify-between flex-1">
          <div className="mt-2 flex flex-col gap-1 text-sm">
        
            {/* أول تذكرتين فقط */}
            {visibleTickets.map((ticket, i) => (
              <div key={i} className="flex justify-between">
                <p className="text-gray-600 flex items-center gap-2">
                  Row <FaArrowRight /> {ticket.row} , Seat <FaArrowRight /> {ticket.seat}
                </p>
                <p className="text-teal-600 font-bold">{ticket.price} EGP</p>
              </div>
            ))}
        
            {/* لو في أكتر من 2 تذاكر */}
            {tickets.length > 1 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-teal-600 text-sm underline mt-1 hover:text-teal-800 w-fit"
              >
                + {tickets.length - 1} more seats...
              </button>
            )}
          </div>
        
          <div className="flex justify-between border-t pt-1 mt-2">
            <p className="mt-2 font-semibold text-black">Total:</p>
            <p className="mt-2 font-bold text-teal-600">{payment.total} EGP</p>
          </div>
      </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              All Seats
            </h2>

            <div className="flex flex-col gap-3 text-sm max-h-[300px] overflow-y-auto pr-2">
              {tickets.map((ticket, i) => (
                <div 
                  key={i}
                  className="flex justify-between border-b pb-1"
                >
                  <p className="text-gray-700 flex items-center gap-2">
                    Row <FaArrowRight /> {ticket.row} , Seat <FaArrowRight /> {ticket.seat}
                  </p>
                  <p className="text-teal-600 font-bold">{ticket.price} EGP</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-5 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
