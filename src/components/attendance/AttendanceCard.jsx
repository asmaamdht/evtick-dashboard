export default function AttendanceCard({ payment }) {
  const fullName = payment.userInfo
    ? `${payment.userInfo.firstName} ${payment.userInfo.lastName}`
    : payment.fullName;

  const firstLetter = fullName?.charAt(0).toUpperCase();

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2 border">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
          {firstLetter}
        </div>
        <div>
          <h3 className="font-bold text-lg">{fullName}</h3>
          <p className="text-sm text-gray-600">{payment.eventName}</p>
        </div>
      </div>

      {/* Tickets */}
      <div className="mt-2 flex flex-col gap-1 text-sm">
        {payment.tickets.map((ticket, i) => (
          <div key={i} className="flex justify-between">
            <p>Row: {ticket.row}, Seat: {ticket.seat}</p>
            <p className="text-teal-700 font-bold">{ticket.price} EGP</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <p className="mt-2 font-semibold">Total: {payment.total} EGP</p>
    </div>
  );
}
