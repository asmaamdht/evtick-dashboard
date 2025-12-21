import React, { useState, useEffect } from 'react';
import { FaMagic, FaRegCopy, FaImage, FaHashtag, FaShareAlt, FaFileAlt } from 'react-icons/fa';
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { showSuccess } from "../../admin/components/events/SweetAlert";

export default function Tickets() {
    const { currentUser } = useSelector(s => s.auth);

    // Form States
    const initialForm = {
        eventName: '',
        category: '',
        date: '',
        time: '',
        description: '',
        location: '', 
        venueId: '',
        venueAddress: '',
        venueLat: null,
        venueLng: null,
        totalSeats: '',
        photo: '',
        mode: 'offline',
    };

    const [form, setForm] = useState(initialForm);
    const [venues, setVenues] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [rows, setRows] = useState([]);
    const [errors, setErrors] = useState({});

    // Generated Content States
    const [hashtags, setHashtags] = useState('');
    const [socialPost, setSocialPost] = useState('');

    // Loading States
    const [loading, setLoading] = useState({
        desc: false,
        poster: false,
        hashtags: false,
        social: false,
        submit: false
    });

    const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

    // Load Data on Mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Categories
                const catSnap = await getDocs(collection(db, "eventTypes"));
                const catList = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setCategories(catList.map(c => c.id));

                // Load Venues
                const venueSnap = await getDocs(collection(db, "venues"));
                const venueList = venueSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setVenues(venueList);
            } catch (err) {
                console.error("Error loading initial data:", err);
            }
        };
        loadData();
    }, []);

    // Handle Mode Change
    useEffect(() => {
        // Reset specific fields when mode changes
        if (form.mode === "online") {
            setSelectedVenue(null);
            update("venueId", "");
            update("totalSeats", "");
            update("location", "");
            setRows(["A"]); // Single price for online
        } else {
            // Offline mode reset
            setSelectedVenue(null);
            update("venueId", "");
            setRows([]);
            update("totalSeats", "");
            update("location", "");
        }
        // clear prices
        const priceKeys = Object.keys(form).filter(k => k.startsWith('price'));
        priceKeys.forEach(k => update(k, ""));

    }, [form.mode]);

    // Handle Venue Selection
    const handleVenueChange = async (venueId) => {
        if (!venueId) {
            setSelectedVenue(null);
            update("venueId", "");
            setRows([]);
            update("totalSeats", "");
            return;
        }
        const venue = venues.find(v => v.id === venueId);
        if (!venue) return;

        setSelectedVenue(venue);
        update("venueId", venue.id);
        update("venueAddress", venue.address);
        update("venueLat", venue.lat);
        update("venueLng", venue.lng);
        // We use the venue name as the location display for offline
        update("location", venue.name);

        if (venue.modelUid) {
            try {
                const snap = await getDoc(doc(db, "seatModel", venue.modelUid));
                if (snap.exists()) {
                    const seats = snap.data().seats || [];
                    update("totalSeats", seats.length);
                    const uniqueRows = [...new Set(seats.map(s => s.row))];
                    setRows(uniqueRows);
                }
            } catch (err) {
                console.error("Error loading seat model:", err);
            }
        }
    };

    // Validate Function
    const validateForm = () => {
        let e = {};
        if (!form.eventName) e.eventName = "Required";
        if (!form.category) e.category = "Required";
        if (!form.date) e.date = "Required";
        if (!form.time) e.time = "Required";
        if (!form.description) e.description = "Required";

        if (form.mode === 'offline') {
            if (!form.venueId) e.venueId = "Required";
        } else {
            if (!form.location) e.location = "Required"; // Address/Link for online
        }

        if (!form.totalSeats) e.totalSeats = "Required";

        if (rows.length === 0) {
            e.prices = "No pricing configuration available";
        } else {
            rows.forEach(r => {
                if (!form[`price${r}`] && form[`price${r}`] !== 0) {
                    e[`price${r}`] = "Required";
                }
            });
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;
        setLoading(prev => ({ ...prev, submit: true }));

        try {
            const fullDate = new Date(`${form.date}T${form.time}`);
            const ref = doc(db, "pendingEvents", crypto.randomUUID());

            const venuePayload = form.mode === "offline" && selectedVenue
                ? {
                    id: selectedVenue.id,
                    name: selectedVenue.name,
                    address: selectedVenue.address,
                    latitude: selectedVenue.latitude || selectedVenue.lat,
                    longitude: selectedVenue.longitude || selectedVenue.lng,
                    seatModel: selectedVenue.modelUid,
                }
                : {};

            let pricePayload;
            if (form.mode === "online") {
                pricePayload = Number(form.priceA);
            } else {
                pricePayload = {};
                rows.forEach(row => {
                    pricePayload[row] = Number(form[`price${row}`]);
                });
            }

            const payload = {
                eventName: form.eventName,
                type: form.category,
                mode: form.mode,
                date: fullDate,
                description: form.description,
                totalTickets: +form.totalSeats,
                availableTickets: +form.totalSeats,
                ticketsSold: 0,
                photo: form.photo,
                price: pricePayload,
                organizerUid: currentUser?.uid,
                eventOwner: currentUser?.eventOwner || '',
                status: "available",
                // Only include address if online
                ...(form.mode === "online" ? { address: form.location } : {}),
                // Only include venue if offline
                ...(form.mode === "offline" && selectedVenue ? { venue: venuePayload } : {}),
            };

            await setDoc(ref, {
                ...payload,
                createdAt: serverTimestamp(),
            });

            showSuccess("Event request submitted successfully!");

            // Allow user to stay or reset? Usually reset.
            setForm(initialForm);
            setRows([]);
            setSelectedVenue(null);
            setHashtags('');
            setSocialPost('');

        } catch (err) {
            console.error(err);
            alert("Error creating event: " + err.message);
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    // Keep AI functions as before, just updating 'form' state
    const generateDescription = async () => {
        if (!form.eventName) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, desc: true }));
        try {
            const res = await fetch('http://localhost:5000/ai/description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: form.eventName, category: form.category, date: form.date, location: form.location })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            update("description", data.text);
        } catch (err) {
            console.error(err);
            alert("Error generating description");
        }
        setLoading(prev => ({ ...prev, desc: false }));
    };

    const generatePoster = async () => {
        if (!form.eventName) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, poster: true }));
        try {
            const res = await fetch('http://localhost:5000/ai/poster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: form.eventName, category: form.category, date: form.date, location: form.location })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            update("photo", data.image);
        } catch (err) {
            console.error(err);
            alert("Error generating poster");
        }
        setLoading(prev => ({ ...prev, poster: false }));
    };

    const generateHashtags = async () => {
        if (!form.eventName) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, hashtags: true }));
        try {
            const res = await fetch('http://localhost:5000/ai/hashtags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: form.eventName })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setHashtags(data.text);
        } catch (err) {
            console.error(err);
            alert("Error generating hashtags");
        }
        setLoading(prev => ({ ...prev, hashtags: false }));
    };

    const generateSocialPost = async () => {
        if (!form.eventName) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, social: true }));
        try {
            const res = await fetch('http://localhost:5000/ai/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: form.eventName, date: form.date, location: form.location })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSocialPost(data.text);
        } catch (err) {
            console.error(err);
            alert("Error generating social post");
        }
        setLoading(prev => ({ ...prev, social: false }));
    };

    return (
        <div className="bg-[#f4f7fa] min-h-screen text-slate-800 font-sans pb-20">
            <div className="max-w-7xl mx-auto pt-10 px-6">
                <div className="flex items-center gap-3 mb-8">
                    <FaMagic className="text-3xl text-[#0f9386]" />
                    <h1 className="text-3xl font-bold text-slate-900">Create New Ticket</h1>
                </div>
                <p className="text-slate-500 mb-8">Generate event content, posters, and details instantly using AI.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - INPUTS */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                        <h2 className="text-xl font-semibold text-[#a62639] mb-6 border-b pb-2">Event Information</h2>

                        {/* Event Title */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                            <input
                                type="text"
                                value={form.eventName}
                                onChange={(e) => update("eventName", e.target.value)}
                                placeholder="Enter event title"
                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.eventName ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                            />
                            {errors.eventName && <span className="text-red-500 text-xs">{errors.eventName}</span>}
                        </div>

                        {/* Mode Selection */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 has-[:checked]:border-[#0f9386] has-[:checked]:bg-[#0f9386]/5 transition-all">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="offline"
                                        checked={form.mode === 'offline'}
                                        onChange={() => update('mode', 'offline')}
                                        className="accent-[#0f9386]"
                                    />
                                    <span>Offline (Venue)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 has-[:checked]:border-[#0f9386] has-[:checked]:bg-[#0f9386]/5 transition-all">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="online"
                                        checked={form.mode === 'online'}
                                        onChange={() => update('mode', 'online')}
                                        className="accent-[#0f9386]"
                                    />
                                    <span>Online (Virtual)</span>
                                </label>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                            <select
                                value={form.category}
                                onChange={(e) => update("category", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.category ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => update("date", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.date ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                                />
                                {errors.date && <span className="text-red-500 text-xs">{errors.date}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Time *</label>
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => update("time", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.time ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                                />
                                {errors.time && <span className="text-red-500 text-xs">{errors.time}</span>}
                            </div>
                        </div>

                        {/* Location / Venue */}
                        {form.mode === 'offline' ? (
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Venue *</label>
                                <select
                                    value={form.venueId}
                                    onChange={(e) => handleVenueChange(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.venueId ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                                >
                                    <option value="">Select Venue</option>
                                    {venues.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {errors.venueId && <span className="text-red-500 text-xs">{errors.venueId}</span>}
                            </div>
                        ) : (
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Online Link / Address *</label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => update("location", e.target.value)}
                                    placeholder="Zoom link or Platform"
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.location ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                                />
                                {errors.location && <span className="text-red-500 text-xs">{errors.location}</span>}
                            </div>
                        )}

                        {/* Total Seats (Read Only for Offline) */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Tickets *</label>
                            <input
                                type="number"
                                value={form.totalSeats}
                                onChange={(e) => update("totalSeats", e.target.value)}
                                placeholder="0"
                                readOnly={form.mode === 'offline'}
                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.totalSeats ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none ${form.mode === 'offline' ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            {errors.totalSeats && <span className="text-red-500 text-xs">{errors.totalSeats}</span>}
                        </div>

                        {/* Pricing Tiers */}
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Ticket Prices</label>
                            {rows.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {rows.map((row) => (
                                        <div key={row} className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 uppercase mb-1">{form.mode === 'online' ? 'General' : `Row ${row}`}</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-slate-400">$</span>
                                                <input
                                                    type="number"
                                                    value={form[`price${row}`] !== undefined ? form[`price${row}`] : ''}
                                                    onChange={(e) => update(`price${row}`, e.target.value)}
                                                    className={`w-full pl-7 pr-4 py-2 rounded-lg bg-slate-50 border ${errors[`price${row}`] ? 'border-red-500' : 'border-slate-200'} focus:border-[#0f9386] outline-none`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {errors[`price${row}`] && <span className="text-red-500 text-[10px] mt-1">{errors[`price${row}`]}</span>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-100 flex items-center gap-2">
                                    Please select a venue (offline) or switch to online mode to configure prices.
                                </div>
                            )}
                            {errors.prices && <span className="text-red-500 text-xs block mt-2">{errors.prices}</span>}
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={loading.submit}
                            className="w-full mt-8 bg-[#0f9386] text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-[#0b6e64] transition-all shadow-lg shadow-[#0f9386]/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading.submit ? 'Creating Event...' : 'Create Ticket Event'}
                        </button>
                    </div>

                    {/* RIGHT COLUMN - AI GENERATOR */}
                    <div className="flex flex-col gap-6">

                        {/* Description Generator */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#0f9386]">
                                    <FaFileAlt />
                                    <h3 className="font-semibold">Event Description</h3>
                                </div>
                                <button
                                    onClick={generateDescription}
                                    disabled={loading.desc}
                                    className="bg-[#0f9386] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0b6e64] transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading.desc ? 'Generating...' : <><FaMagic /> Generate</>}
                                </button>
                            </div>
                            <textarea
                                value={form.description}
                                onChange={(e) => update('description', e.target.value)}
                                className={`w-full min-h-[100px] p-4 bg-slate-50 rounded-xl border border-dashed text-slate-600 text-sm leading-relaxed outline-none focus:border-[#0f9386] resize-y ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
                                placeholder="Click generate or type description here..."
                            />
                            {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                        </div>

                        {/* Poster Generator */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#0f9386]">
                                    <FaImage />
                                    <h3 className="font-semibold">Event Poster</h3>
                                </div>
                                <button
                                    onClick={generatePoster}
                                    disabled={loading.poster}
                                    className="bg-[#0f9386] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0b6e64] transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading.poster ? 'Generating...' : <><FaMagic /> Generate</>}
                                </button>
                            </div>
                            <div className="h-[250px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3">
                                {form.photo ? (
                                    <img src={form.photo} alt="Event Poster" className="h-full object-cover w-full" />
                                ) : (
                                    <span className="text-slate-400 text-sm">Poster preview will appear here</span>
                                )}
                            </div>
                            <input
                                type="text"
                                value={form.photo}
                                onChange={(e) => update('photo', e.target.value)}
                                placeholder="Image URL"
                                className="w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 outline-none focus:border-[#0f9386]"
                            />
                        </div>

                        {/* Hashtags Generator */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#0f9386]">
                                    <FaHashtag />
                                    <h3 className="font-semibold">Hashtags</h3>
                                </div>
                                <button
                                    onClick={generateHashtags}
                                    disabled={loading.hashtags}
                                    className="bg-[#0f9386] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0b6e64] transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading.hashtags ? 'Generating...' : <><FaMagic /> Generate</>}
                                </button>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-[#0f9386] font-medium text-sm">
                                {hashtags || "No hashtags generated yet..."}
                            </div>
                        </div>

                        {/* Social Post Generator */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#0f9386]">
                                    <FaShareAlt />
                                    <h3 className="font-semibold">Social Media Post</h3>
                                </div>
                                <button
                                    onClick={generateSocialPost}
                                    disabled={loading.social}
                                    className="bg-[#0f9386] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0b6e64] transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading.social ? 'Generating...' : <><FaMagic /> Generate</>}
                                </button>
                            </div>
                            <div className="min-h-[80px] p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-600 text-sm whitespace-pre-wrap">
                                {socialPost || "Click to generate a social media caption..."}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}