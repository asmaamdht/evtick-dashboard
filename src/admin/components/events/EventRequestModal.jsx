export default function EventRequestModal({
  event,
  onClose,
  onApprove,
  onRefuse,
  confirmRefuse,
  setConfirmRefuse,
}) {
  if (!event) return null;

  return (
    <>
      {/* moadl */}
      <div className="fixed inset-0 bg-black/15 flex items-center justify-center px-4 z-50">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl overflow-y-auto max-h-[90vh] p-6 px-8">

          <h2 className="text-2xl font-bold mb-4">{event.eventName}</h2>

          {/* event image */}
          <img
            src={event.photo}
            className="w-full h-60 object-cover rounded-lg shadow mb-6"
            alt=""
          />

          {/*info from the form*/}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Category" value={event.type} />
            <Info label="Organizer UID" value={event.organizerUid} />
            <Info label="Organizer" value={event.eventOwner} />
            {/* <Info label="Organizer UID" value={event.organizerUid} /> */}
            <Info label="Mode" value={event.mode} />
             <Info
              label="Date"
              value={event.date.toDate().toLocaleDateString()}
            />
            <Info label="Address" value={event.address} />
           
            <Info
              label="Time"
              value={event.date.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <Info label="Total Tickets" value={event.totalTickets} />
          </div>

           {/* description */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <div className="border shadow py-2 text-gray-700 whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* prices*/}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Ticket Prices</h3>
            <div className="grid grid-cols-2 gap-3">
              <Price label="A" value={event.price?.A} />
              <Price label="B" value={event.price?.B} />
              <Price label="C" value={event.price?.C} />
              <Price label="D" value={event.price?.D} />
            </div>
          </div>

          {/*btns*/}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Close
            </button>

            <button
              onClick={() => setConfirmRefuse(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Refuse
            </button>

            <button
              onClick={onApprove}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      {/*refuse confirmation*/}
      {confirmRefuse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
            <p className="mb-6 text-lg font-semibold">
              Are you sure you want to refuse this event?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmRefuse(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={onRefuse}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes, Refuse
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*components*/
function Info({ label, value }) {
  return (
    <div >
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <div className="font-medium py-2 border shadow">{value}</div>
    </div>
  );
}

function Price({ label, value }) {
  return (
    <div className="p-3 bg-gray-100 rounded-lg text-center">
      <p className="font-bold text-lg">{label}</p>
      <div className="text-sm py-2 border shadow text-gray-700">{value} egp</div>
    </div>
  );
}
