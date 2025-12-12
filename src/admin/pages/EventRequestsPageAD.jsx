import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import EventRequestModal from "../components/events/EventRequestModal";
import Filters from "../components/events/Filters";
import { showSuccess } from "../components/events/SweetAlert";
import { showWarning } from "../components/events/SweetAlert";

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

    const newRef = doc(db, "events", selected.id);
    await setDoc(newRef, selected);
    await deleteDoc(doc(db, "pendingEvents", selected.id));

    setPendingEvents(p => p.filter(e => e.id !== selected.id));
    setSelected(null);

    showSuccess("Event Approved & Published");
  };

  //refuse event
  const refuseEvent = async () => {
    if (!selected) return;

    await deleteDoc(doc(db, "pendingEvents", selected.id));

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
      <div className="flex flex-col md:items-start md:justify-start gap-4 mb-6">

        <h1 className="text-2xl font-bold">Pending Event Requests</h1>

        <div className="w-full flex md:justify-end">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {filtered.map(ev => (
          <div
            key={ev.id}
            onClick={() => setSelected(ev)}
            className="cursor-pointer relative bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition"
          >
            <div className="h-44 w-full overflow-hidden">
              <img src={ev.photo} className="w-full h-full object-cover" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
              <h2 className="text-lg font-bold">{ev.eventName}</h2>
              <p className="text-sm opacity-90">{ev.type}</p>
              <p className="text-xs opacity-80">
                Organizer: <span className="font-semibold">{ev.eventOwner}</span>
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
