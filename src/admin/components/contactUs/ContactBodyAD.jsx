import React from 'react';

export default function ContactBodyAD({ msg }) {
    return (
        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-4 bg-white dark:bg-gray-800">
            {/* User Message */}
            <div className="w-full">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 dark:text-gray-200 leading-relaxed shadow-sm relative border border-gray-100 dark:border-gray-600">
                    <p className="whitespace-pre-wrap break-words">{msg.message || msg.content || "No message content."}</p>
                </div>
                {msg.createdAt && (
                    <div className="flex items-center justify-between mt-1.5 pl-2">
                        <p className="text-[10px] text-gray-400">
                            {new Date(msg.createdAt.toDate ? msg.createdAt.toDate() : msg.createdAt).toLocaleString()}
                        </p>
                        {!msg.adminReply && <span className="text-[10px] font-medium text-indigo-500">New Message</span>}
                    </div>
                )}
            </div>

            {/* Admin Reply (if exists) */}
            {msg.adminReply && (
                <div className="w-full flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#0f9386] p-4 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed shadow-md relative max-w-[90%]">
                        <p className="whitespace-pre-wrap break-words">{msg.adminReply}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1.5 pr-2">
                        {msg.replyTimestamp ? new Date(msg.replyTimestamp).toLocaleDateString() : 'Replied'}
                    </span>
                </div>
            )}
        </div>
    );
}
