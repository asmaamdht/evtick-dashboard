import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import validate from "./validate";
import EventForm from "./EventForm";


export default function CreateOrEditEvent() {

  const { eventId } = useParams();
  const { currentUser } = useSelector(s => s.auth);

  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});



  const initialForm = {
  eventName:"",
  type:"",
  address:"",
  date:"",
  time:"",
  mode:"offline",
  totalTickets:"",
  description:"",
  priceA:"", priceB:"", priceC:"", priceD:"",
  photo:""
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

      setForm({
        eventName: d.eventName || "",
        type: d.type || "",
        address: d.address || "",
        date: d.date ? d.date.toDate().toISOString().split("T")[0] : "",
        time: d.date ? d.date.toDate().toISOString().slice(11,16) : "",
        description: d.description || "",
        totalTickets: d.totalTickets || "",
        photo: d.photo || "",
        mode: d.mode || "offline",
        priceA: d.price?.A || "",
        priceB: d.price?.B || "",
        priceC: d.price?.C || "",
        priceD: d.price?.D || "",
      });
    }
  }

  loadEvent();
}, [eventId]);



  // save in firestore
  const save=async()=>{
  const errors = validate(form);
  setErrors(errors);
  if (Object.keys(errors).length !== 0) return;

    const fullDate=new Date(`${form.date}T${form.time}`);
    const ref = doc(db,"events",eventId || crypto.randomUUID());

    const payload={
      eventName:form.eventName,
      type:form.type,
      address:form.address,
      date:fullDate,
      description:form.description,
      totalTickets:+form.totalTickets,
      mode:form.mode,
      ticketsSold:0,
      photo:form.photo,
      price:{A:+form.priceA,B:+form.priceB,C:+form.priceC,D:+form.priceD},
      organizerUid:currentUser.uid,
      eventOwner:currentUser.eventOwner,
    //   createdAt:eventId?undefined:serverTimestamp(),
      status:"available"  
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
    alert(eventId?"Updated Successfully":"Event Created");
  };

  
return (
    <EventForm
      form={form}
      errors={errors}
      update={update}
      save={save}
      showSuggestions={showSuggestions}
      setShowSuggestions={setShowSuggestions}
    />
  );
}