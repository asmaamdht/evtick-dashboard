import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import Textarea from "./Textarea";
import { useParams } from "react-router-dom";
//import DatePicker from "react-datepicker";
import Datetime from "react-datetime";
import dayjs from "dayjs";
import "react-datetime/css/react-datetime.css";
import "../../style/index.css";

export default function EventForm({
  form,
  errors,
  update,
  save,
  showSuggestions,
  setShowSuggestions,
  categories
}) {

  const { eventId } = useParams();


  return (<div className="max-w-6xl ">
    <h2 className=" text-2xl font-bold mb-6">{eventId ? "Edit Event" : "Create Event"}</h2>
    <div className="shadow border p-3 bg-white rounded-xl">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Event Name" value={form.eventName} onChange={v => update("eventName", v)} error={errors.eventName} />

        {/* type and auto suggest */}
        <div className="relative">
          <Field label="Category" value={form.type}
            onChange={v => { update("type", v); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)} error={errors.type}
          />

          {/* {showSuggestions && form.type && (
      <div className="absolute w-full bg-white border shadow-lg z-40 rounded max-h-36 overflow-y-auto"
        onMouseLeave={() => setShowSuggestions(false)}>
        {categories.filter(c => c.toLowerCase().startsWith(form.type.toLowerCase())).map((c, i) => (
          <p key={i} onClick={() => { update("type", c); setShowSuggestions(false) }}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer">{c}</p>
        ))}
      </div>
          )} */}
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

        </div >

        <Field label="Address" value={form.address} onChange={v => update("address", v)} error={errors.address} className="mt-3" />
      </div >
    </div >
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

          {/* Designated image box */}
          <div className="mt-3 w-full h-52 bg-gray-100 rounded-xl shadow flex items-center justify-center overflow-hidden">
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

        {/* date and time */}
        <div className="shadow border p-2 mt-5 bg-white rounded-xl">
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Field
              type="date"
              label="Event Date"
              value={form.date}
              onChange={(v) => update("date", v)}
              error={errors.date}
            />

            <Field
              type="time"
              label="Event Time"
              value={form.time}
              onChange={(v) => update("time", v)}
              error={errors.time}
            />
          </div>

          {/* calender and time picker*/}
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
                  input={false}       // keeps it always open
                  isValidDate={(currentDate) => {
                    // disable today and all past dates
                    const tomorrowDate = dayjs().add(1, "day").startOf("day");
                    return currentDate.isAfter(tomorrowDate);
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
                <Field label="A" type="number" value={form.priceA} onChange={(v) => update("priceA", v)}
                  error={errors.priceA} />
                <Field label="B" type="number" value={form.priceB} onChange={(v) => update("priceB", v)}
                  error={errors.priceB} />
                <Field label="C" type="number" value={form.priceC} onChange={(v) => update("priceC", v)}
                  error={errors.priceC} />
                <Field label="D" type="number" value={form.priceD} onChange={(v) => update("priceD", v)}
                  error={errors.priceD} />
              </div>
            </div>
          </div>
        </div>

        {/* total tickets and mode */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="shadow border p-3 bg-white rounded-xl ">
            <Field type="number"
              label="Total Tickets"
              value={form.totalTickets}
              onChange={(v) => update("totalTickets", v)}
              error={errors.totalTickets} />
          </div>
          <div className="shadow border p-3 bg-white rounded-xl">
            <div className="grid grid-rows-2 gap-2">
              <label className="block mt-1">Event Type</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                <Radio label="Online" checked={form.mode === "online"} onChange={() => update("mode", "online")} />
                <Radio label="Offline" checked={form.mode === "offline"} onChange={() => update("mode", "offline")} />
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
        className="  text-white font-bold p-3 rounded-lg hover:bg-teal-700" style={{ background: "#0f9386" }}>
        {eventId ? "Save Changes" : "Create Event"}
      </button>
    </div>
  </div >
  );
}

/* feild and radio component*/
function Field({ label, value, onChange, type = "text", error, onFocus }) {
  return (
    <div >
      <label>{label}</label>
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} onFocus={onFocus}
        className={`w-full p-2 rounded mt-1 bg-gray-100/60 border
          ${error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-teal-500 "
          } 
          outline-none`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}


function Radio({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-1">
      <input type="radio" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}
