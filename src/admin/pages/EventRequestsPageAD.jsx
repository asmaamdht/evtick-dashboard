import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  addDoc
} from "firebase/firestore";
import EventRequestModal from "../components/events/EventRequestModal";
import Filters from "../components/events/Filters";
import { showSuccess } from "../components/events/SweetAlert";
import { showWarning } from "../components/events/SweetAlert";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

export default function EventRequestsPageAD() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmRefuse, setConfirmRefuse] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);

  const isSameDay = (d1, d2) => {
  return (
    d1.toDate().toDateString() === d2.toDate().toDateString()
  );
};

  
  // load pendingEvents +eventTypes
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "pendingEvents"));
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingEvents(arr);
      setFiltered(arr);
      setLoading(false);

      const typesSnap = await getDocs(collection(db, "eventTypes"));
      setCategories(typesSnap.docs.map(d => d.id)); // storing just names
    };
    load();
  }, []);

  
  // search and filter handling
  useEffect(() => {
    let result = pendingEvents;

    const s = search.toLowerCase();

    if (s) {
      result = result.filter(ev =>
        ev.eventName.toLowerCase().includes(s) ||
        ev.organizerUid?.toLowerCase().includes(s) ||
        ev.id.toLowerCase().includes(s)
      );
    }

    if (category) {
      result = result.filter(ev => ev.type === category);
    }

    // filtered 
    setFiltered(result);
  }, [search, category, pendingEvents]);

  //autocomplete suuggestions
   const handleSearch = (value) => {
    setSearch(value);

    if (!value) return setAutocomplete([]);

    const s = value.toLowerCase();

    const suggestions = pendingEvents
      .filter(ev =>
        ev.eventName.toLowerCase().includes(s) ||
        ev.id.toLowerCase().includes(s) ||
        ev.organizerUid?.toLowerCase().includes(s)
      )
      .slice(0, 5);

    setAutocomplete(suggestions);
  };

  const applySuggestion = (text) => {
    setSearch(text);
    setAutocomplete([]);
  };



 //reset filters
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setAutocomplete([]);
  };

  //approve event
const approveEvent = async () => {
  if (!selected) return;

  // publish approved event
  await setDoc(doc(db, "events", selected.id), selected);
  await deleteDoc(doc(db, "pendingEvents", selected.id));

  // notify approved organizer
  if (selected.organizerUid) {
    await addDoc(collection(db, "notifications"), {
      uid: selected.organizerUid,
      title: "Event Approved",
      message: `Your event "${selected.eventName}" has been approved and published.`,
      timestamp: new Date(),
      read: false,
      type: "success",
    });
  }

  // find conflicting pending events
  const conflicts = pendingEvents.filter(ev => {
    if (ev.id === selected.id) return false;

    // same day
    if (!isSameDay(ev.date, selected.date)) return false;

    // offline conflict
    if (
      selected.mode === "offline" &&
      ev.mode === "offline" &&
      ev.venue?.id === selected.venue?.id
    ) {
      return true;
    }

    //online conflict
    if (
      selected.mode === "online" &&
      ev.mode === "online"
    ) {
      return true;
    }

    return false;
  });

  //auto-reject conflicts
  for (const ev of conflicts) {
    await deleteDoc(doc(db, "pendingEvents", ev.id));

    if (ev.organizerUid) {
      await addDoc(collection(db, "notifications"), {
        uid: ev.organizerUid,
        title: "Event Rejected",
        message:
          selected.mode === "offline"
            ? "This venue is already booked for the selected date. Please choose another date."
            : "This date is already booked. Please choose another date.",
        timestamp: new Date(),
        read: false,
        type: "error",
      });
    }
  }

  // Update pending events page
  setPendingEvents(prev =>
    prev.filter(ev =>
      ev.id !== selected.id &&
      !conflicts.some(c => c.id === ev.id)
    )
  );

  setSelected(null);
  showSuccess("Event Approved & Published");
};




  //refuse event
  const refuseEvent = async (reason) => {
    if (!selected) return;

    await deleteDoc(doc(db, "pendingEvents", selected.id));

    
    // Notify Organizer
    try {
      if (selected.organizerUid) {
        await addDoc(collection(db, "notifications"), {
          uid: selected.organizerUid,
          title: "Event Refused",
          message: `Your event "${selected.eventName}" was refused. Reason: ${reason}`,
          timestamp: new Date(),
          read: false,
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error creating notification: ", error);
    }

    setPendingEvents(p => p.filter(e => e.id !== selected.id));
    setSelected(null);
    setConfirmRefuse(false);

    showWarning("Event Refused & Removed");
  };

  if (loading) return <p>Loading...</p>;

  //empty pending events
  const getEmptyMessage = () => {
    if (pendingEvents.length === 0)
      return "No pending requests.";

    if (category && filtered.length === 0)
      return "No pending requests in this category.";

    if (search && filtered.length === 0)
      return "No pending events match your search.";

    return null;
  };

  return (
    <div>
      {/* <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-4 mb-6"> */}
         <div className="flex flex-col p-6 md:items-start md:justify-start gap-4 mb-6">

        <h1 className="text-3xl font-bold">Pending Event Requests</h1>

  <div className="w-full flex md:justify-start mt-5">
      <Filters
    search={search}
    setSearch={setSearch}
    category={category}
    setCategory={setCategory}
    categories={categories}
    handleSearch={handleSearch}
    resetFilters={resetFilters}
    autocomplete={autocomplete}
     setAutocomplete={setAutocomplete}
    applySuggestion={applySuggestion}
  />
      </div>
      </div>

      {/* empty message */}
      {getEmptyMessage() && (
        <p className="text-center text-gray-600 mt-10">{getEmptyMessage()}</p>
      )}

      {/*grid*/}
      <div className="grid grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(ev => (
          <div
            key={ev.id}
            onClick={() => setSelected(ev)}
            className="cursor-pointer relative bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition group"
          >
            <div className="h-80 w-full overflow-hidden">
              <img src={ev.photo} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
            </div>

           <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
          <h2 className="text-lg font-bold mb-2">{ev.eventName}</h2>

          <p className="text-xs opacity-80 flex items-center gap-1 mb-1">
            <FaCalendarAlt className="text-xs" />
            {ev.date.toDate().toLocaleDateString()}
          </p>

        <p className="text-xs opacity-80 flex items-center gap-1 mb-1">
            <FaMapMarkerAlt className="text-xs" />
             {ev.mode === "offline" ? ev.venue?.name : ev.address}
          </p>

          <p className="text-sm opacity-90 flex items-center gap-1 mb-1">
            <FaTicketAlt className="text-xs" />
            {ev.type}
          </p>

          <p className="text-xs opacity-80 flex items-center gap-1 mb-1">
            <FaUser className="text-xs" />
            <span className="font-semibold">{ev.eventOwner}</span>
          </p>

        </div>

          </div>
        ))}
      </div>

      {/* madal */}
      <EventRequestModal
        event={selected}
        onClose={() => setSelected(null)}
        onApprove={approveEvent}
        onRefuse={refuseEvent}
        confirmRefuse={confirmRefuse}
        setConfirmRefuse={setConfirmRefuse}
      />
    </div>
  );
}
