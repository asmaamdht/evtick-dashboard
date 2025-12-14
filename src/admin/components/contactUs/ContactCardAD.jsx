import React from 'react';
import ContactHeaderAD from './ContactHeaderAD';
import ContactBodyAD from './ContactBodyAD';
import ContactReplayAD from './ContactReplayAD';

export default function ContactCardAD({
  msg,
  replyingTo,
  replyText,
  setReplyText,
  handleReplyClick,
  handleCancelReply,
  handleSendReply,
  handleMarkAsRead
}) {
  const isReplying = replyingTo === msg.id;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden flex flex-col transition-all hover:shadow-xl group relative ${!msg.adminReply ? 'border-indigo-200 dark:border-indigo-700 ring-1 ring-indigo-50 dark:ring-indigo-900' : 'border-gray-100 dark:border-gray-700'}`}
      style={{ height: "450px" }}
    >
      {/* Unread Indicator Badge (Overlay on whole card or specific area) */}
      {!msg.adminReply && (
        <div className="absolute top-4 right-4 z-10 animate-pulse">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </div>
      )}

      <ContactHeaderAD msg={msg} handleMarkAsRead={handleMarkAsRead} />
      <ContactBodyAD msg={msg} />
      <ContactReplayAD
        msg={msg}
        isReplying={isReplying}
        replyText={replyText}
        setReplyText={setReplyText}
        handleReplyClick={handleReplyClick}
        handleCancelReply={handleCancelReply}
        handleSendReply={handleSendReply}
      />
    </div>
  );
}
