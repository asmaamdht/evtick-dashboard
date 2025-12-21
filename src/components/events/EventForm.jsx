import DatePicker from "react-datepicker";
import Textarea from "./Textarea";
import Datetime from "react-datetime";
import dayjs from "dayjs";
import "react-datetime/css/react-datetime.css";
import "../../style/index.css";  

export default function EventForm({
    form,
  errors,
  update,
  save,
  loading,
  categories,

  showSuggestions,
  setShowSuggestions,
  categoryRef,

  venues,
  filteredVenues,
  onVenueSearch,
  selectVenue,
  showVenueSuggestions,
  setShowVenueSuggestions,
  venueRef,

  rows,
  bookedDates
}) {

   return (
     <div className=" ">  
      
      
       <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* LEFT */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2 p-3 shadow border bg-white rounded-xl">
        <Field label="Event Name" value={form.eventName} onChange={v=>update("eventName",v)} error={errors.eventName}/>
        
        {/* type and auto suggest */}
        <div className="relative" ref={categoryRef}>
          <Field label="Category" value={form.type}
            onChange={v=>{update("type",v);setShowSuggestions(true)}} 
            onFocus={()=>setShowSuggestions(true)} error={errors.type}
          />
  
          {showSuggestions && (
          <div
            className="absolute w-full bg-white border shadow-lg z-40 rounded max-h-36 overflow-y-auto"
            onMouseLeave={() => setShowSuggestions(false)}
          >
            {(form.type
              ? categories.filter(c =>
                  c.toLowerCase().startsWith(form.type.toLowerCase())
                )
              : categories
            ).map((c, i) => (
              <p
                key={i}
                onMouseDown={() => { update("type", c); setShowSuggestions(false); }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer cursor-pointer"
              >
                {c}
              </p>
            ))}
          </div>
        )}

        </div>
        </div>
   <div className="shadow border p-3 bg-white rounded-xl flex flex-col items-center justify-center">
         {/* <div className="grid grid-rows-2 gap-2"> */}
        <label className=" block mb-2 text-teal-600 font-semibold">Event Type</label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-12 mt-1">
            <Radio
          label="Online"
          checked={form.mode==="online"}
          onChange={() => update("mode","online")}
          />

          <Radio label="Offline" 
          checked={form.mode==="offline"} 
          onChange={()=>update("mode","offline")}/>
        </div>
        {/* </div> */}
        </div>
      
  </div>
  </div>
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
  
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4">
  
      {/* //desc */}
  <div className="p-3 bg-white rounded-xl mt-7">
   
  <Textarea
    label="Description"
    rows={8}
    value={form.description}
    onChange={(v) => update("description", v)}
    error={errors.description}
  />
  
  </div>
  

   {/* Image field */}
   <div className="mt-6 bg-white p-3 rounded-xl">
  <label className="block mb-2">Event Image URL</label>
  <input
    type="url"
    value={form.photo}
    placeholder="https://image.com/img.jpg"
    onChange={e => update("photo", e.target.value)}
    className={`w-full p-2 rounded border mt-1 bg-gray-100/60 
      ${errors.photo ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-500"} 
      outline-none`}
  />
  {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}

  {/* image box */}
  <div className="mt-3 w-full h-64 bg-gray-100 rounded-xl shadow flex items-center justify-center overflow-hidden">
    {form.photo ? (
      <img src={form.photo} alt="Event" className="w-full h-full object-cover rounded-xl" />
    ) : (
      <p className="text-gray-400">Image preview will appear here</p>
    )}
  </div>
</div>

      </div>
  
      {/* RIGHT SIDE */}

      <div className="flex flex-col gap-4 mt-2" >

         {/* total tickets and mode */}
 <div className="grid grid-cols-2 gap-4 mt-4">
 <div className="shadow border p-3 bg-white rounded-xl ">
  {form.mode === "offline" ? (
    <div className="relative" ref={venueRef}>
      <Field
        label="Venue"
        value={form.address}
        onChange={onVenueSearch}
        error={errors.address}
        onFocus={() => setShowVenueSuggestions(true)}
      />

      {showVenueSuggestions && (
        <div className="absolute w-full bg-white border shadow z-40 rounded max-h-36 overflow-y-auto">
          {filteredVenues.map(v => (
            <p
              key={v.id}
              onMouseDown={() => selectVenue(v)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {v.name}
            </p>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Field
      label="Online Event Address"
      value={form.address}
      onChange={v => update("address", v)}
      error={errors.address}
    />
  )}
</div>


  <div className="shadow border p-3 bg-white rounded-xl ">
     <Field
  type="number"
  label="Total Tickets"
  value={form.totalTickets}
  error={errors.totalTickets}
  disabled={form.mode === "offline"}
  onChange={form.mode === "online" ? v => update("totalTickets", v) : undefined}
/>
      </div>
     
  </div>

         {/* date and time */}
       <div className="shadow border p-2 mt-5 bg-white rounded-xl">
  <div className="grid grid-cols-2 gap-3 mt-2">
    <Field
  type="date"
  label="Event Date"
  value={form.date}
  onChange={ v => update("date", v)}
  error={errors.date}
  disabled
/>


  
    <Field
      type="time"
      label="Event Time"
      value={form.time}
      onChange={(v) => update("time", v)}
      error={errors.time}
      disabled
    />
  </div>
  
  {/* calender and time*/}
  <div className="mt-4 rounded-lg overflow-auto">
    {/* <p className="font-medium mb-2">Select Date & Time</p> */}
    <div className=" rounded-xl border p-3 shadow mt-4 max-w-full">
  <p className="font-semibold mb-3" style={{ color: "#0f9386" }}>Select Date & Time</p>

<div className="overflow-auto">
  <Datetime
    value={
      form.date && form.time
        ? dayjs(`${form.date}T${form.time}`).toDate()
        : null
    }
    onChange={(date) => {
      const d = dayjs(date);
      update("date", d.format("YYYY-MM-DD"));
      update("time", d.format("HH:mm"));
    }}
    timeFormat="HH:mm"
    dateFormat="YYYY-MM-DD"
    input={false}       // always open
   isValidDate={(currentDate) => {
  const day = currentDate.format("YYYY-MM-DD");

  // past dates
  if (currentDate.isSameOrBefore(dayjs(), "day")) return false;

  // block booked
  return !bookedDates.includes(day);
}}

  />
  </div>
</div>
  </div>
  </div>

  
  
  
 {/* Prices box */}
 <div >
  <div className="border rounded-lg p-4 mt-4 bg-white">
    <p className="mb-2">Ticket Prices</p>
    <div>
    <div className="grid grid-cols-2 gap-4 p-2 shadow border rounded-xl">
      {rows.map(row => (
  <Field
    key={row}
    label={form.mode === "online" ? "Ticket Price" : row}
    type="number"
    value={form[`price${row}`]}
    onChange={v => update(`price${row}`, v)}
    error={errors[`price${row}`]}
  />
))}

    </div>
    </div>
  </div>
  </div>
  
      
      </div>
    </div>
      {/* save */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          className="  text-white font-bold p-3 rounded-lg hover:bg-teal-700" 
          style={{ background: "#0f9386" }}>
             {loading ? (
      <div className="flex items-center justify-center gap-2">
        <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
        Creating...
      </div>
    ) : (
      "Create Event"
    )}
        </button>
  </div>
    </div>
   );
  }
  
  /* feild and radio component*/
  function Field({ label, value, onChange, type="text", error, onFocus, disabled }) {
    return(
   <div >
    <label>{label}</label>
    <input 
    type={type}
    value={value || ""}
    disabled={disabled}
    onChange={e => onChange?.(e.target.value)}
    onFocus={onFocus}
    className={`w-full p-2 rounded mt-1 bg-gray-100/60 border
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          ${error 
            ? "border-red-500 focus:border-red-500" 
            : "border-gray-300 focus:border-teal-500 "
          } 
          outline-none`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
   </div>
  )}
  
  
  function Radio({label,checked,onChange}){
    return(
   <label className="flex items-center gap-1">
     <input type="radio" checked={checked} onChange={onChange}/>
     {label}
   </label>
  )}
