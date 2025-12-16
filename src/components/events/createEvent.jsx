import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import validate from "./validate";
import EventForm from "./EventForm";
import { showSuccess } from "../../admin/components/events/SweetAlert";
import { collection, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import dayjs from "dayjs";



export default function CreateOrEditEvent() {

  const { eventId } = useParams();
  const { currentUser } = useSelector(s => s.auth);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [rows, setRows] = useState([]);




  // const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const categories = [
    "Charity","Entertainment","sports","Tech","Marketing",
    "Educational","Community","Corporate","School & University"
  ];



 const initialForm = {
  eventName: "",
  type: "",
  venueId: "",
  venueLat: null,
  venueLng: null,
  venueAddress: "",
  address: "",
  date: "",
  time: "",
  mode: "offline",
  totalTickets: "",
  description: "",
  photo: ""
};




const [form, setForm] = useState(initialForm);


  const update=(k,v)=>setForm(p=>({...p,[k]:v}));

  // load event data if editing
useEffect(() => {
  if (!eventId) return; // only run if editing

  const loadEvent = async () => {
    const snap = await getDoc(doc(db, "events", eventId));
    if (snap.exists()) {
      const d = snap.data();

      const prices = {};
      if (d.price) {
        Object.keys(d.price).forEach(k => {
          prices[`price${k}`] = d.price[k] || "";
        });
      }

      setForm({
        eventName: d.eventName || "",
        type: d.type || "",
        address: d.mode === "offline" ? d.venue?.name || "" : d.address || "",
        // date: d.date ? d.date.toDate().toISOString().split("T")[0] : "",
        // time: d.date ? d.date.toDate().toISOString().slice(11,16) : "",
        date: d.date ? dayjs(d.date.toDate()).format("YYYY-MM-DD") : "",
        time: d.date ? dayjs(d.date.toDate()).format("HH:mm") : "",
        description: d.description || "",
        totalTickets: d.totalTickets || "",
        photo: d.photo || "",
        mode: d.mode || "offline",
       ...prices,
      });
    }
  }

  loadEvent();
}, [eventId]);

useEffect(() => {
  const loadVenues = async () => {
    const snap = await getDocs(collection(db, "venues"));
    const list = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    setVenues(list);
    setFilteredVenues(list);
  };
  loadVenues();
}, []);

const onVenueSearch = (value) => {
  update("address", value);
  setShowVenueSuggestions(true);

  setFilteredVenues(
    venues.filter(v =>
      v.name.toLowerCase().includes(value.toLowerCase())
    )
  );
};

const selectVenue = (venue) => {
  setSelectedVenue(venue);

  update("venueId", venue.id);
  update("address", venue.name);          //update 
  update("venueAddress", venue.address); // real address
  update("venueLat", venue.lat);
  update("venueLng", venue.lng);

  setShowVenueSuggestions(false);
};


useEffect(() => {
  if (!selectedVenue?.modelUid) return;

  const loadSeats = async () => {
    const snap = await getDoc(doc(db, "seatModel", selectedVenue.modelUid));
    if (!snap.exists()) return;

    const seats = snap.data().seats || [];
    update("totalTickets", seats.length);
  };

  loadSeats();
}, [selectedVenue]);


useEffect(() => {
  const loadBookedDates = async () => {
    let dates = [];

    if (form.mode === "online") {
      const q1 = query(collection(db, "events"), where("mode", "==", "online"));
      const q2 = query(collection(db, "pendingEvents"), where("mode", "==", "online"));

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      dates = [...s1.docs, ...s2.docs].map(d =>
        dayjs(d.data().date.toDate()).format("YYYY-MM-DD")
      );
    }

    if (form.mode === "offline" && selectedVenue) {
      const q1 = query(collection(db, "events"), where("venue.id", "==", selectedVenue.id));
      const q2 = query(collection(db, "pendingEvents"), where("venue.id", "==", selectedVenue.id));

      const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      dates = [...s1.docs, ...s2.docs].map(d =>
        dayjs(d.data().date.toDate()).format("YYYY-MM-DD")
      );
    }

    setBookedDates(dates);
  };

  loadBookedDates();
}, [form.mode, selectedVenue]);



useEffect(() => {
  // reset feilds in these cases
  if (
    !form.date ||
    form.mode !== "offline" ||
    eventId // edit mode, don't refilter
  ) {
    setFilteredVenues(venues);
    return;
  }

  const filterVenuesByDate = async () => {
    const [eventsSnap, pendingSnap] = await Promise.all([
      getDocs(collection(db, "events")),
      getDocs(collection(db, "pendingEvents")),
    ]);

    const booked = [...eventsSnap.docs, ...pendingSnap.docs]
      .filter(d => d.data().venue && d.data().date)
      .map(d => ({
        venueId: d.data().venue.id,
        date: dayjs(d.data().date.toDate()).format("YYYY-MM-DD"),
      }));

    const unavailableVenueIds = booked
      .filter(b => b.date === form.date)
      .map(b => b.venueId);

    setFilteredVenues(
      venues.filter(v => !unavailableVenueIds.includes(v.id))
    );
  };

  filterVenuesByDate();
}, [form.date, form.mode, venues, eventId]);



useEffect(() => {
  const updated = {};

  rows.forEach(r => {
    updated[`price${r}`] = form[`price${r}`] || "";
  });

  setForm(prev => ({
    ...prev,
    ...updated
  }));
}, [rows]);



useEffect(() => {
  if (!selectedVenue?.modelUid) return;

  const loadRows = async () => {
    const snap = await getDoc(doc(db, "seatModel", selectedVenue.modelUid));
    if (!snap.exists()) return;

    const uniqueRows = [...new Set(
      snap.data().seats.map(s => s.row)
    )];

    setRows(uniqueRows);
  };

  loadRows();
}, [selectedVenue]);

useEffect(() => {
  if (!form.date) return;
}, [form.date]);

useEffect(() => {
  if (form.mode === "online") {
    setSelectedVenue(null);
    update("venueId", "");
    update("totalTickets", "");
    setRows(["A"]); // one price only
    update("address", "");
    // setRows(prev => prev.length ? prev : ["A"]);
  }
}, [form.mode]);



  // save in firestore
  const save=async()=>{
  const errors = validate(form, categories, rows);
  setErrors(errors);
  if (Object.keys(errors).length !== 0) return;

    const fullDate=new Date(`${form.date}T${form.time}`);
    // const ref = doc(db,"events",eventId || crypto.randomUUID());
    const ref = eventId
    ? doc(db, "events", eventId)
    : doc(db, "pendingEvents", crypto.randomUUID());

    const venuePayload = form.mode === "offline" && selectedVenue
  ? {
      id: selectedVenue.id,
      name: selectedVenue.name,
      address: selectedVenue.address,
      latitude: selectedVenue.latitude,
      longitude: selectedVenue.longitude,
      seatModel: selectedVenue.modelUid,
    }
  : {};

 const pricePayload = {};
rows.forEach(row => {
  pricePayload[row] = Number(form[`price${row}`]);
});



    const payload = {
  eventName: form.eventName,
  type: form.type,
  mode: form.mode,
  date: fullDate,
  description: form.description,
  totalTickets: +form.totalTickets,
  ticketsSold: 0,
  photo: form.photo,
 price: pricePayload,
  organizerUid: currentUser.uid,
  eventOwner: currentUser.eventOwner,
  status: "available",
  ...(form.mode === "online" ? { address: form.address } : {}), // only online gets address
  ...(form.mode === "offline" && selectedVenue ? { 
      venue: venuePayload
    } : {}
  ),
};


    if (eventId) {
  await updateDoc(ref, payload);
} else {
  await setDoc(ref, {
    ...payload,
    createdAt: serverTimestamp(), //only when creating
  });
  setForm(initialForm); // reset form after creation
}
    // eventId ? await updateDoc(ref,payload) : await setDoc(ref,payload);
    // alert(eventId?"Updated Successfully":"Admin will review your request");
    showSuccess(eventId?"Updated Successfully":"Admin will review your request");
  };

  
return (
    <EventForm
  form={form}
  errors={errors}
  update={update}
  save={save}
  categories={categories}

  /* category autosuggest */
  showSuggestions={showSuggestions}
  setShowSuggestions={setShowSuggestions}

  /* venue logic */
  venues={venues}
  filteredVenues={filteredVenues}
  onVenueSearch={onVenueSearch}
  selectVenue={selectVenue}
  showVenueSuggestions={showVenueSuggestions}
  setShowVenueSuggestions={setShowVenueSuggestions}

  /* seating / booking */
  rows={rows}
  bookedDates={bookedDates}
/>

  );
}