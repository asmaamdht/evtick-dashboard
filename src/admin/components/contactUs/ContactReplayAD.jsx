import React from 'react';
import { Send, Reply } from "lucide-react";

export default function ContactReplayAD({
  msg,
  isReplying,
  replyText,
  setReplyText,
  handleReplyClick,
  handleCancelReply,
  handleSendReply
}) {
  return (
    <div className="p-4 bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-700 min-h-[80px] flex items-center justify-center">
      {isReplying ? (
        // Reply Input Mode
        <div className="w-full flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex-1 relative">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-[#0f9386] focus:ring-2 focus:ring-teal-100 dark:bg-gray-700 dark:text-white transition-all text-sm outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply(msg.id);
                if (e.key === 'Escape') handleCancelReply();
              }}
            />
            <button
              onClick={handleCancelReply}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              title="Cancel"
            >
              &times;
            </button>
          </div>
          <button
            onClick={() => handleSendReply(msg.id)}
            className="p-3 bg-[#0f9386] hover:bg-[#0c7a6e] text-white rounded-xl shadow-lg shadow-teal-200 dark:shadow-none transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // Default Mode: Reply Button
        !msg.reply ? (
          <div className="w-full flex justify-end gap-3">
            <button
              onClick={() => handleReplyClick(msg.id)}
              className="px-6 py-2.5 bg-[#0f9386] hover:bg-[#0c7a6e] text-white text-sm font-semibold rounded-xl shadow-md shadow-teal-100 dark:shadow-none transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center text-gray-400 text-sm font-medium italic">
            Message replied
          </div>
        )
      )}
    </div>
  );
}
