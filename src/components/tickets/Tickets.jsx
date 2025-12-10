import React, { useState } from 'react';
import { FaMagic, FaRegCopy, FaImage, FaHashtag, FaShareAlt, FaFileAlt } from 'react-icons/fa';

export default function Tickets() {
    // Form States
    const [eventTitle, setEventTitle] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [totalSeats, setTotalSeats] = useState('');
    const [prices, setPrices] = useState({ a: '', b: '', c: '', d: '' });

    // Generated Content States
    const [description, setDescription] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [socialPost, setSocialPost] = useState('');

    // Loading States
    const [loading, setLoading] = useState({
        desc: false,
        poster: false,
        hashtags: false,
        social: false
    });

    const handlePriceChange = (tier, value) => {
        setPrices(prev => ({ ...prev, [tier]: value }));
    };

    // Mock Generation Functions
    const generateDescription = () => {
        if (!eventTitle) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, desc: true }));
        setTimeout(() => {
            setDescription(`Experience the magic of ${eventTitle}! Join us for an unforgettable evening at ${location || 'our venue'} on ${date || 'upcoming date'}. Secure your seats now for a night of wonder and excitement.`);
            setLoading(prev => ({ ...prev, desc: false }));
        }, 1500);
    };

    const generatePoster = () => {
        if (!eventTitle) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, poster: true }));
        setTimeout(() => {
            // Using a placeholder image service for demo
            setPosterUrl(`https://placehold.co/600x400/101820/FFF?text=${encodeURIComponent(eventTitle)}`);
            setLoading(prev => ({ ...prev, poster: false }));
        }, 2000);
    };

    const generateHashtags = () => {
        if (!eventTitle) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, hashtags: true }));
        setTimeout(() => {
            const baseTags = ['#Events', '#Live', '#Tickets'];
            const titleTags = eventTitle.split(' ').map(word => `#${word}`);
            setHashtags([...titleTags, ...baseTags].join(' '));
            setLoading(prev => ({ ...prev, hashtags: false }));
        }, 1000);
    };

    const generateSocialPost = () => {
        if (!eventTitle) return alert("Please enter an event title");
        setLoading(prev => ({ ...prev, social: true }));
        setTimeout(() => {
            setSocialPost(`Don't miss out on ${eventTitle}! 🎟️\n\n📅 Date: ${date || 'TBA'}\n📍 Location: ${location || 'TBA'}\n\nGrab your tickets now before they sell out! Link in bio. 👇\n\n${hashtags}`);
            setLoading(prev => ({ ...prev, social: false }));
        }, 1500);
    };

    return (
        <div className=" bg-[#f4f7fa] min-h-screen text-slate-800 font-sans">
            <div className="max-w-7xl ">
                <div className="flex items-center gap-3 mb-8">
                    <FaMagic className="text-3xl text-[#0f9386]" />
                    <h1 className="text-3xl font-bold text-slate-900">AI Content Generator</h1>
                </div>
                <p className="text-slate-500 mb-8">Generate event content, posters, and details instantly using AI.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - INPUTS */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                        <h2 className="text-xl font-semibold text-[#a62639] mb-6 border-b pb-2">Event Information</h2>

                        {/* Title */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                            <input
                                type="text"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                placeholder="Enter event title"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0f9386] focus:ring-2 focus:ring-[#0f9386]/20 outline-none transition-all"
                            />
                        </div>

                        {/* Category */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0f9386] outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="concert">Concert</option>
                                <option value="conference">Conference</option>
                                <option value="workshop">Workshop</option>
                                <option value="theater">Theater</option>
                            </select>
                        </div>

                        {/* Date & Location */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0f9386] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City or Venue"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0f9386] outline-none"
                                />
                            </div>
                        </div>

                        {/* Total Seats */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Seats</label>
                            <input
                                type="number"
                                value={totalSeats}
                                onChange={(e) => setTotalSeats(e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0f9386] outline-none"
                            />
                        </div>

                        {/* Pricing Tiers */}
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Ticket Prices (by Class)</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['a', 'b', 'c', 'd'].map((tier) => (
                                    <div key={tier} className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-400 uppercase mb-1">Class {tier.toUpperCase()}</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-slate-400">$</span>
                                            <input
                                                type="number"
                                                value={prices[tier]}
                                                onChange={(e) => handlePriceChange(tier, e.target.value)}
                                                className="w-full pl-7 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#0f9386] outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                            <div className="min-h-[100px] p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-600 text-sm leading-relaxed">
                                {description || "Click generate to create an AI-powered description for your event..."}
                            </div>
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
                            <div className="h-[250px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                {posterUrl ? (
                                    <img src={posterUrl} alt="Event Poster" className="h-full object-cover" />
                                ) : (
                                    <span className="text-slate-400 text-sm">Poster preview will appear here</span>
                                )}
                            </div>
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