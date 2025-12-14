import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase.config"; // Adjusted path
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import ContactCardAD from "../components/contactUs/ContactCardAD";
import { MessageCircle, Filter } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ContactUsAD() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'unread', 'replied', 'pending'
  const [replyingTo, setReplyingTo] = useState(null); // ID of message being replied to
  const [replyText, setReplyText] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Updated collection name "contactMessages" and sorting by "createdAt"
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [];
    if (filterStatus === "all") {
      result = messages;
    } else if (filterStatus === "unread") {
      result = messages.filter(msg => !msg.isRead);
    } else if (filterStatus === "replied") {
      result = messages.filter(msg => msg.status === "replied");
    } else if (filterStatus === "pending") {
      result = messages.filter(msg => !msg.adminReply);
    }
    setFilteredMessages(result);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [messages, filterStatus]);


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: Scroll to top of grid
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleReplyClick = (msgId) => {
    setReplyingTo(msgId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleMarkAsRead = async (msgId, event) => {
    event.stopPropagation(); // Prevent triggering other clicks
    try {
      const msgRef = doc(db, "contactMessages", msgId);
      await updateDoc(msgRef, {
        isRead: true
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendReply = async (msgId) => {
    if (!replyText.trim()) return;

    try {
      const msgRef = doc(db, "contactMessages", msgId);
      await updateDoc(msgRef, {
        adminReply: replyText,
        replyTimestamp: new Date().toISOString(),
        status: "replied",
        isRead: false // Set to false so it shows as unread for the user
      });

      // Success message removed as per user request

      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send reply. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Commented out header as per user edit previously, assuming they want to keep it hidden or restore later. Leaving as user left it. */}
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Customer Messages
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage and reply to inquiries from the "Contact Us" page.
          </p>
        </div> */}

        {/* Filter Controls - keeping this on the right/alone if header is hidden */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ml-auto">
          <Filter className="w-4 h-4 text-gray-500 ml-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer py-1 pr-2"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="pending">Pending Reply</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No messages found matching your filter.</p>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="mt-4 text-[#0f9386] hover:underline text-sm"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((msg) => (
              <ContactCardAD
                key={msg.id}
                msg={msg}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleReplyClick={handleReplyClick}
                handleCancelReply={handleCancelReply}
                handleSendReply={handleSendReply}
                handleMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredMessages.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-8 gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0f9386] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
              >
                <FaChevronLeft size={14} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm
                      ${currentPage === i + 1
                        ? 'bg-[#0f9386] text-white shadow-md shadow-teal-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0f9386] hover:text-[#0f9386]'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0f9386] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
}
