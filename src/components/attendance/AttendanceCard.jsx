import { FaArrowRight } from "react-icons/fa";

export default function AttendanceCard({ payment }) {
  const fullName = payment.userInfo
    ? `${payment.userInfo.firstName} ${payment.userInfo.lastName}`
    : payment.fullName;

  const firstLetter = fullName?.charAt(0).toUpperCase();

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border w-80 h-auto hover:shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_20px_rgba(13,148,136,0.6)] ">
    
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {firstLetter}
        </div>
        <div>
          <h3 className="font-bold text-lg text-black">{fullName}</h3>
          <p className="text-sm text-gray-600">{payment.eventName}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1 text-sm">
        {payment.tickets.map((ticket, i) => (
          <div key={i} className="flex justify-between">
            <p className="text-gray-600 flex items-center gap-2">Row <FaArrowRight/> {ticket.row} , Seat <FaArrowRight/> {ticket.seat}</p>
            <p className="text-teal-600 font-bold">{ticket.price} EGP</p>
          </div>
        ))}
      </div>

    <div className="flex justify-between border-t pt-1 mt-2">
        <p className="mt-2 font-semibold text-black">Total:</p>
          <p className="mt-2 font-bold text-teal-600"> {payment.total} EGP</p>
    </div>
    </div>
  );
}
