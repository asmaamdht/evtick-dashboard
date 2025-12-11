import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Pencil, Trash2, Play, Search } from "lucide-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EVENT_TYPES = [
  "Sports",
  "Tec",
  "School & University",
  "Marketing",
  "Entertainment",
  "Educational",
  "Corporate",
  "Community",
  "Charity",
];

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterOnline, setFilterOnline] = useState(""); // Online/Offline filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // show more per page for 4 columns

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    address: "",
    photo: "",
    type: "",
    isOnline: false,
    date: "",
    totalTickets: "",
    priceA: "",
    priceB: "",
    priceC: "",
    priceD: "",
  });

  const navigate = useNavigate();

  // Fetch all events for admin
  useEffect(() => {
    const fetchEvents = async () => {
      const snapshots = await getDocs(collection(db, "events"));
      const list = snapshots.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setEvents(list);
    };
    fetchEvents();
  }, []);

  // Edit event
  const handleEditClick = (event) => {
    setEditEvent(event.id);
    setForm({
      eventName: event.eventName || "",
      description: event.description || "",
      address: event.address || "",
      photo: event.photo || "",
      type: event.type || "",
      isOnline: event.isOnline || false,
      date: event.date?.toDate
        ? (() => {
            const d = event.date.toDate();
            const tzOffset = d.getTimezoneOffset(); // minutes
            return new Date(d.getTime() - tzOffset * 60000)
              .toISOString()
              .slice(0, 16);
          })()
        : "",
      totalTickets: event.totalTickets || "",
      priceA: event.price?.A || "",
      priceB: event.price?.B || "",
      priceC: event.price?.C || "",
      priceD: event.price?.D || "",
    });
  };

  const validateForm = () => {
    if (!form.eventName.trim()) return "Event name required";
    if (!form.date.trim()) return "Date is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.type.trim()) return "Event type required";
    if (isNaN(form.totalTickets)) return "Total tickets must be a number";
    if (
      isNaN(form.priceA) ||
      isNaN(form.priceB) ||
      isNaN(form.priceC) ||
      isNaN(form.priceD)
    )
      return "Prices must be numbers";
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) return alert(error);

    const ref = doc(db, "events", editEvent);
    await updateDoc(ref, {
      eventName: form.eventName,
      description: form.description,
      address: form.address,
      photo: form.photo,
      type: form.type,
      isOnline: form.isOnline,
      date: (() => {
        const localDate = new Date(form.date);
        const tzOffset = localDate.getTimezoneOffset();
        return new Date(localDate.getTime() + tzOffset * 60000);
      })(),
      totalTickets: Number(form.totalTickets),
      price: {
        A: Number(form.priceA),
        B: Number(form.priceB),
        C: Number(form.priceC),
        D: Number(form.priceD),
      },
    });

    setEvents((prev) =>
      prev.map((e) =>
        e.id === editEvent
          ? {
              ...e,
              ...form,
              date: new Date(form.date),
              price: {
                A: form.priceA,
                B: form.priceB,
                C: form.priceC,
                D: form.priceD,
              },
            }
          : e
      )
    );
    setEditEvent(null);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "events", deleteId));
    setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    setShowDeleteConfirm(false);
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const goToStream = () => navigate("/dashboard/stream");

  // Filter by search, type, and online/offline
  const filtered = events.filter((e) => {
    const matchesName = e.eventName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType ? e.type === filterType : true;
    const matchesOnline =
      filterOnline === ""
        ? true
        : filterOnline === "online"
        ? e.isOnline
        : !e.isOnline;
    return matchesName && matchesType && matchesOnline;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-[#111]">
        Admin – Manage Events
      </h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 w-full md:w-72">
          <Search size={18} />
          <input
            placeholder="Search by name"
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-xl px-3 py-2 w-full md:w-72"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="border rounded-xl px-3 py-2 w-full md:w-72"
          value={filterOnline}
          onChange={(e) => setFilterOnline(e.target.value)}
        >
          <option value="">All</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginated.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all overflow-hidden group"
          >
            <div className="h-48 w-full overflow-hidden rounded-t-2xl relative">
              {event.photo ? (
                <img
                  src={event.photo}
                  alt=""
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{event.eventName}</h3>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                <FaCalendarAlt />{" "}
                {event?.date?.toDate
                  ? event.date.toDate().toLocaleString()
                  : "No date"}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                <FaMapMarkerAlt /> {event.address}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                <FaTicketAlt /> {event.type}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => handleEditClick(event)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl w-full sm:w-auto justify-center hover:bg-gray-200"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => requestDelete(event.id)}
                  className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-xl text-red-600 w-full sm:w-auto justify-center hover:bg-red-200"
                >
                  <Trash2 size={16} /> Delete
                </button>
                {event.isOnline && (
                  <button
                    onClick={goToStream}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-xl text-blue-600 w-full sm:w-auto justify-center"
                  >
                    <Play size={18} /> Stream
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 text-teal-700 border border-teal-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            <HiChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                    currentPage === pageNum
                      ? "bg-teal-600 text-white border-2 border-teal-400 shadow-lg scale-110"
                      : "bg-white/70 backdrop-blur-sm text-teal-700 border border-teal-300 hover:bg-white"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 backdrop-blur-sm text-teal-700 border border-teal-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            Next
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4 text-white bg-teal-600 p-3 rounded-lg">
              Edit Event
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Event Name
                </label>
                <input
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.eventName}
                  onChange={(e) =>
                    setForm({ ...form, eventName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <textarea
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Photo URL
                </label>
                <input
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Address
                </label>
                <input
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Type
                </label>
                <select
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) =>
                    setForm({ ...form, isOnline: e.target.checked })
                  }
                  className="accent-teal-500"
                />
                Online Event
              </label>

              <div className="grid grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((p) => (
                  <div key={p}>
                    <label className="font-medium text-gray-700 mb-1 block">
                      Price {p}
                    </label>
                    <input
                      className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                      value={form[`price${p}`]}
                      onChange={(e) =>
                        setForm({ ...form, [`price${p}`]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Total Tickets
                </label>
                <input
                  className="border p-3 rounded-xl w-full focus:border-teal-500 focus:ring-1 focus:ring-teal-300"
                  value={form.totalTickets}
                  onChange={(e) =>
                    setForm({ ...form, totalTickets: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                onClick={() => setEditEvent(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delete Event?</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
