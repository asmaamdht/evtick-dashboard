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
  getDoc,
} from "firebase/firestore";
import { Pencil, Trash2, Play, Search } from "lucide-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const EVENT_TYPES = [
  "Sports",
  "Tech",
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
  const [venues, setVenues] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [form, setForm] = useState({
    eventName: "",
    description: "",
    address: "",
    photo: "",
    type: "",
    mode: "offline",
    date: "",
    totalTickets: "",
    price: "", // For online events - single number
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch venues on mount
  useEffect(() => {
    const loadVenues = async () => {
      const snap = await getDocs(collection(db, "venues"));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setVenues(list);
    };
    loadVenues();
  }, []);

  // Convert Firestore date to local datetime string for input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().slice(0, 16);
  };

  // Fetch user events
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

  // Function to load seat rows from a venue
  const loadSeatRows = async (venue) => {
    if (!venue?.modelUid) {
      setRows([]);
      return [];
    }

    setLoadingSeats(true);
    try {
      const snap = await getDoc(doc(db, "seatModel", venue.modelUid));
      if (!snap.exists()) {
        setRows([]);
        return [];
      }

      const seats = snap.data().seats || [];
      const uniqueRows = [...new Set(seats.map((s) => s.row))];

      // Sort rows alphabetically
      uniqueRows.sort();

      setRows(uniqueRows);
      return uniqueRows;
    } catch (error) {
      console.error("Error loading seat rows:", error);
      setRows([]);
      return [];
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleEditClick = async (event) => {
    setEditEvent(event.id);
    setRows([]);
    setSelectedVenue(null);

    // Parse the event data
    const eventData = {
      eventName: event.eventName || "",
      description: event.description || "",
      photo: event.photo || "",
      type: event.type || "",
      mode: event.mode || "offline",
      date: formatDateForInput(event.date),
      totalTickets: event.totalTickets?.toString() || "",
    };

    // Initialize form with basic data
    const newForm = { ...eventData };

    if (event.mode === "online") {
      // Online event - price is a single number
      newForm.address = event.address || "";
      // Check if price is a number or object (for backward compatibility)
      newForm.price = typeof event.price === 'number' 
        ? event.price.toString() 
        : (event.price?.A?.toString() || "");
    } else {
      // Offline event - IMPORTANT: Set the venue that was already selected
      if (event.venue?.id) {
        // Find the venue in our list - this will be the default
        const venue = venues.find((v) => v.id === event.venue.id);
        if (venue) {
          // Set as selected venue immediately (default selection)
          setSelectedVenue(venue);

          // Load seat rows for this venue
          const seatRows = await loadSeatRows(venue);

          // Add existing prices to form
          seatRows.forEach((row) => {
            const priceKey = `price${row}`;
            newForm[priceKey] = event.price?.[row]?.toString() || "";
          });

          // Set address from venue
          newForm.address = venue.name;
        } else {
          // Venue not found in list, fallback to address
          newForm.address = event.address || "";
          // Try to infer rows from price object
          const priceRows = event.price ? Object.keys(event.price) : ["A", "B"];
          setRows(priceRows);
          priceRows.forEach((row) => {
            newForm[`price${row}`] = event.price?.[row]?.toString() || "";
          });
        }
      } else {
        // Fallback for old events without venue structure
        newForm.address = event.address || "";
        // Try to infer rows from price object
        const priceRows = event.price ? Object.keys(event.price) : ["A", "B"];
        setRows(priceRows);
        priceRows.forEach((row) => {
          newForm[`price${row}`] = event.price?.[row]?.toString() || "";
        });
      }
    }

    setForm(newForm);
  };

  const validateForm = () => {
    const errors = [];

    if (!form.eventName.trim()) errors.push("Event name is required");
    if (!form.date.trim()) errors.push("Date is required");
    if (!form.type.trim()) errors.push("Event type is required");

    if (form.mode === "online") {
      if (!form.address.trim()) {
        errors.push("Online address/URL is required");
      }
      // Validate single price for online events
      if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
        errors.push("Price must be a valid number");
      }
    }

    if (form.mode === "offline" && !selectedVenue) {
      errors.push("Please select a venue");
    }

    if (
      !form.totalTickets ||
      isNaN(form.totalTickets) ||
      Number(form.totalTickets) <= 0
    ) {
      errors.push("Total tickets must be a positive number");
    }

    // Validate price fields for offline events
    if (form.mode === "offline") {
      rows.forEach((row) => {
        const priceKey = `price${row}`;
        const price = form[priceKey];
        if (!price || isNaN(price) || Number(price) < 0) {
          errors.push(`Price for row ${row} must be a valid number`);
        }
      });
    }

    return errors.length > 0 ? errors.join("\n") : null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      // Prepare update data
      const updateData = {
        eventName: form.eventName.trim(),
        description: form.description.trim(),
        photo: form.photo.trim(),
        type: form.type,
        mode: form.mode,
        date: new Date(form.date),
        totalTickets: Number(form.totalTickets),
      };

      // Add mode-specific data
      if (form.mode === "online") {
        // Online event: price is a single number
        updateData.price = Number(form.price);
        updateData.address = form.address.trim();
        updateData.venue = null; // Clear venue for online events
      } else {
        // Offline event: price is a map of row -> price
        const pricePayload = {};
        rows.forEach((row) => {
          const priceKey = `price${row}`;
          pricePayload[row] = Number(form[priceKey]) || 0;
        });
        updateData.price = pricePayload;
        updateData.address = selectedVenue?.name || "";
        if (selectedVenue) {
          updateData.venue = {
            id: selectedVenue.id,
            name: selectedVenue.name,
            address: selectedVenue.address,
            latitude: selectedVenue.latitude,
            longitude: selectedVenue.longitude,
            seatModel: selectedVenue.modelUid,
          };
        }
      }

      const ref = doc(db, "events", editEvent);
      await updateDoc(ref, updateData);

      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent
            ? {
                ...e,
                ...updateData,
              }
            : e
        )
      );

      // Reset form
      setEditEvent(null);
      setRows([]);
      setSelectedVenue(null);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  // Handle venue selection
  const handleVenueSelect = async (venueId) => {
    if (!venueId) {
      setSelectedVenue(null);
      setRows([]);
      setForm((prev) => ({
        ...prev,
        totalTickets: "",
        address: "",
      }));
      return;
    }

    const venue = venues.find((v) => v.id === venueId);
    if (!venue) return;

    setSelectedVenue(venue);

    // Load seat rows for this venue
    const seatRows = await loadSeatRows(venue);

    // Create new form with cleared prices for new rows
    const newForm = { ...form };

    // Clear all existing price fields first
    Object.keys(newForm).forEach((key) => {
      if (key.startsWith("price") && key !== "price") {
        delete newForm[key];
      }
    });

    // Initialize price fields for new rows
    seatRows.forEach((row) => {
      newForm[`price${row}`] = "";
    });

    // Update address and total tickets
    newForm.address = venue.name;

    // Get total tickets from seat model
    if (venue.modelUid) {
      try {
        const snap = await getDoc(doc(db, "seatModel", venue.modelUid));
        if (snap.exists()) {
          const seats = snap.data().seats || [];
          newForm.totalTickets = seats.length.toString();
        }
      } catch (error) {
        console.error("Error loading seat count:", error);
      }
    }

    setForm(newForm);
  };

  // Handle mode change
  const handleModeChange = (mode) => {
    const newForm = { ...form, mode };

    if (mode === "online") {
      // Clear venue-related data
      setSelectedVenue(null);
      setRows([]); // No rows for online events

      // Clear old price fields (row-based prices)
      Object.keys(newForm).forEach((key) => {
        if (key.startsWith("price") && key !== "price") {
          delete newForm[key];
        }
      });

      // Initialize single price field if not exists
      if (!newForm.price) {
        newForm.price = "";
      }

      // Reset address to empty for online input
      newForm.address = "";
    } else {
      // Offline mode - reset rows and clear prices
      setRows([]);

      // Clear single price field
      newForm.price = "";

      // Clear all row-based price fields
      Object.keys(newForm).forEach((key) => {
        if (key.startsWith("price") && key !== "price") {
          delete newForm[key];
        }
      });
    }

    setForm(newForm);
  };

  // Update form field
  const updateFormField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update price field (for offline events with rows)
  const updatePriceField = (row, value) => {
    const priceKey = `price${row}`;
    setForm((prev) => ({
      ...prev,
      [priceKey]: value,
    }));
  };

  // Get ALL venues (no filtering)
  const getAvailableVenues = () => {
    if (form.mode !== "offline") return [];
    return venues; // Return all venues without any filtering
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "events", deleteId));
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const goToStream = () => navigate("/dashboard/stream");

  const filtered = events.filter(
    (e) =>
      e.eventName.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? e.type === typeFilter : true)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-8 text-[#111]">Manage Events</h2>

      {/* SEARCH & TYPE FILTER */}
      <div className="flex flex-wrap w-full bg-white rounded-lg p-2 gap-4 mb-6 items-center">
        <div className="flex items-center flex-1 gap-2 bg-gray-100 border rounded-xl px-3 py-2 w-full md:w-72">
          <Search size={18} className="text-teal-600" />
          <input
            placeholder="Search by name"
            className="outline-none w-full bg-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-xl flex-1 px-3 py-2 w-full bg-gray-100 md:w-72"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type} Events
            </option>
          ))}
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
                  alt={event.eventName}
                  className="w-full  object-cover transform group-hover:scale-105 transition-transform duration-300"
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
                {event?.date
                  ? new Date(
                      event.date.toDate ? event.date.toDate() : event.date
                    ).toLocaleString()
                  : "No date"}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                <FaMapMarkerAlt />{" "}
                {event.mode === "online"
                  ? "Online Event"
                  : event.venue?.name || event.address}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                <FaTicketAlt /> {event.type} • {event.mode}
              </div>
              <div className="text-gray-500 text-sm mb-2">
                Tickets: {event.totalTickets || 0} total •{" "}
                {event.ticketsSold || 0} sold
              </div>
            

              <div className="flex justify-between gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(event)}
                  className="flex flex-1 items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl w-full sm:w-auto justify-center"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => requestDelete(event.id)}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-xl text-red-600 w-full sm:w-auto justify-center"
                >
                  <Trash2 size={16} /> Delete
                </button>

                {event.mode === "online" && (
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
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-white bg-teal-600 p-3 rounded-lg">
              Edit Event
            </h3>

            <div className="flex flex-col gap-3">
              {/* Event Mode Toggle */}
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="offline"
                    checked={form.mode === "offline"}
                    onChange={() => handleModeChange("offline")}
                  />
                  Offline Event
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={form.mode === "online"}
                    onChange={() => handleModeChange("online")}
                  />
                  Online Event
                </label>
              </div>

              {/* Event Name */}
              <div>
                <label className="font-semibold">Event Name </label>
                <input
                  className="border p-3 rounded-xl w-full"
                  value={form.eventName}
                  onChange={(e) => updateFormField("eventName", e.target.value)}
                  placeholder="Enter event name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold">Description</label>
                <textarea
                  className="border p-3 rounded-xl w-full"
                  value={form.description}
                  onChange={(e) =>
                    updateFormField("description", e.target.value)
                  }
                  placeholder="Describe your event"
                  rows="3"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="font-semibold">Photo URL</label>
                <input
                  className="border p-3 rounded-xl w-full"
                  value={form.photo}
                  onChange={(e) => updateFormField("photo", e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                {form.photo && (
                  <div className="mt-2">
                    <img
                      src={form.photo}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=Image+Not+Found";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div>
                <label className="font-semibold">Date & Time </label>
                <input
                  type="datetime-local"
                  className="border p-3 rounded-xl w-full"
                  value={form.date}
                  onChange={(e) => updateFormField("date", e.target.value)}
                />
              </div>

              {/* Mode-specific fields */}
              {form.mode === "online" ? (
                <>
                  <div>
                    <label className="font-semibold">Online Address/URL </label>
                    <input
                      className="border p-3 rounded-xl w-full"
                      value={form.address}
                      onChange={(e) => updateFormField("address", e.target.value)}
                      placeholder="e.g., Zoom link, YouTube URL, website"
                    />
                  </div>
                  
                  {/* Single Price for Online Events */}
                  <div>
                    <label className="font-semibold">Ticket Price </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="border p-3 rounded-xl w-full"
                      value={form.price}
                      onChange={(e) => updateFormField("price", e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Price per ticket
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <label className="font-semibold">Venue </label>
                  <select
                    className="border p-3 rounded-xl w-full"
                    value={selectedVenue?.id || ""}
                    onChange={(e) => handleVenueSelect(e.target.value)}
                  >
                    <option value="">Select a venue</option>
                    {getAvailableVenues().map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} - {venue.address}
                      </option>
                    ))}
                  </select>
                  {loadingSeats && (
                    <p className="text-sm text-blue-600 mt-1">
                      Loading venue seats...
                    </p>
                  )}
                  {selectedVenue && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Venue Details:</strong> {selectedVenue.address}
                        <br />
                        <strong>Capacity:</strong> {form.totalTickets} seats
                        <br />
                        <strong>Seat Rows:</strong> {rows.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Event Type */}
              <div>
                <label className="font-semibold">Event Type </label>
                <select
                  className="border p-3 rounded-xl w-full"
                  value={form.type}
                  onChange={(e) => updateFormField("type", e.target.value)}
                >
                  <option value="">Select Type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Price Fields for Offline Events */}
              {form.mode === "offline" && rows.length > 0 && (
                <div className="border-t pt-4">
                  <label className="font-semibold">Ticket Prices by Row </label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {rows.map((row) => (
                      <div key={row} className="bg-gray-50 p-3 rounded-lg">
                        <label className="font-medium block mb-1">
                          Row "{row}"
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="border p-2 rounded-lg w-full"
                          value={form[`price${row}`] || ""}
                          onChange={(e) =>
                            updatePriceField(row, e.target.value)
                          }
                          placeholder="0.00"
                        />
                        <span className="text-xs text-gray-500">
                          Per ticket
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Tickets */}
              <div>
                <label className="font-semibold">Total Tickets </label>
                <input
                  type="number"
                  min="1"
                  className="border p-3 rounded-xl w-full"
                  value={form.totalTickets}
                  onChange={(e) =>
                    updateFormField("totalTickets", e.target.value)
                  }
                  disabled={form.mode === "offline" && selectedVenue}
                  title={
                    form.mode === "offline" && selectedVenue
                      ? "Venue capacity is fixed"
                      : ""
                  }
                />
                {form.mode === "offline" && selectedVenue ? (
                  <p className="text-sm text-gray-500 mt-1">
                    Venue capacity is fixed at {form.totalTickets} seats
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the total number of available tickets
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                onClick={() => {
                  setEditEvent(null);
                  setRows([]);
                  setSelectedVenue(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                onClick={handleSave}
              >
                Save Changes
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
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                onClick={confirmDelete}
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No events message */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No events found. Create your first event!
          </p>
        </div>
      )}
    </div>
  );
}