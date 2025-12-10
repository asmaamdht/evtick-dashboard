import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { Pencil, Trash2, Play, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      const q = query(
        collection(db, "events"),
        where("eventOwner", "==", user.fullName)
      );

      const snapshots = await getDocs(q);
      const list = snapshots.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setEvents(list);
    };

    fetchEvents();
  }, [user]);

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
        ? event.date.toDate().toISOString().slice(0, 16)
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
    if (isNaN(form.priceA) || isNaN(form.priceB))
      return "Prices must be numbers";

    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const ref = doc(db, "events", editEvent);

    await updateDoc(ref, {
      eventName: form.eventName,
      description: form.description,
      address: form.address,
      photo: form.photo,
      type: form.type,
      isOnline: form.isOnline,
      date: new Date(form.date),
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

  // Navigate to dashboard stream page
  const goToStream = () => {
    navigate("/dashboard/stream");
  };

  const filtered = events.filter((e) =>
    e.eventName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-8 text-[#111]">Manage Events</h2>

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
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginated.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-xl transition-all w-full"
          >
            <div className="h-48 bg-gray-100 rounded-xl overflow-hidden mb-4">
              {event.photo ? (
                <img
                  src={event.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold">{event.eventName}</h3>
            <p className="text-gray-500">
              📅{" "}
              {event?.date?.toDate
                ? event.date.toDate().toLocaleString()
                : "No date"}
            </p>
            <p className="text-gray-500">📍 {event.address}</p>
            <p className="text-gray-500">🎫 {event.type}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleEditClick(event)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl w-full sm:w-auto justify-center"
              >
                <Pencil size={16} /> Edit
              </button>

              <button
                onClick={() => requestDelete(event.id)}
                className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-xl text-red-600 w-full sm:w-auto justify-center"
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
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-8">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Edit Event</h3>

            <div className="flex flex-col gap-4">
              <input
                className="border p-3 rounded-xl"
                placeholder="Event Name"
                value={form.eventName}
                onChange={(e) =>
                  setForm({ ...form, eventName: e.target.value })
                }
              />
              <textarea
                className="border p-3 rounded-xl"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                className="border p-3 rounded-xl"
                placeholder="Photo URL"
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
              />
              <input
                type="datetime-local"
                className="border p-3 rounded-xl"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                className="border p-3 rounded-xl"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <input
                className="border p-3 rounded-xl"
                placeholder="Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) =>
                    setForm({ ...form, isOnline: e.target.checked })
                  }
                />
                Online Event
              </label>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Price A"
                  value={form.priceA}
                  onChange={(e) => setForm({ ...form, priceA: e.target.value })}
                />
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Price B"
                  value={form.priceB}
                  onChange={(e) => setForm({ ...form, priceB: e.target.value })}
                />
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Price C"
                  value={form.priceC}
                  onChange={(e) => setForm({ ...form, priceC: e.target.value })}
                />
                <input
                  className="border p-3 rounded-xl"
                  placeholder="Price D"
                  value={form.priceD}
                  onChange={(e) => setForm({ ...form, priceD: e.target.value })}
                />
              </div>

              <input
                className="border p-3 rounded-xl"
                placeholder="Total Tickets"
                value={form.totalTickets}
                onChange={(e) =>
                  setForm({ ...form, totalTickets: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-xl"
                onClick={() => setEditEvent(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delete Event?</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-xl"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
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
