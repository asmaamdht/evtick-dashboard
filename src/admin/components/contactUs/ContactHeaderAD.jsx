import React from 'react';
import { User, Check } from "lucide-react";

export default function ContactHeaderAD({ msg, handleMarkAsRead }) {
    return (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
            <div className="relative">
                {msg.avatar ? (
                    <img
                        src={msg.avatar}
                        alt={msg.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-100 dark:ring-teal-900"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-[#0f9386] dark:text-teal-300 ring-2 ring-teal-50 dark:ring-teal-950">
                        <User className="w-5 h-5" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0 pr-6"> {/* Padding right for badge space */}
                <h3 className={`text-base truncate ${!msg.adminReply ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-200'}`}>
                    {msg.fullName || msg.name || "Anonymous User"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {msg.email || "No Email"}
                </p>
            </div>


        </div>
    );
}
