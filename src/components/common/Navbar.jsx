import React ,{ useState, useEffect, useRef }  from "react";
// import { AiOutlineSearch } from "react-icons/ai";
// import SearchInput from "./SearchInput";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaBell, FaTrash, FaCheckDouble } from "react-icons/fa";
import { db } from "../../firebase/firebase.config";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from "firebase/firestore";

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.auth);

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Add Page Title In Navbar By Using Location ::
    const location = useLocation();

    const path = location.pathname.split("/").filter(Boolean);

    const PageTitle =
        path.length > 0
            ? path.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ")
            : "Dashboard";


               // Close notifications when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch notifications
    useEffect(() => {
        if (!currentUser?.uid) return;

        console.log("Setting up notification listener for:", currentUser.uid);
        const q = query(
            collection(db, "notifications"),
            where("uid", "==", currentUser.uid),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Notification snapshot received. Docs:", snapshot.docs.length);
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(notifs);
        }, (error) => {
            console.error("Notification listener error:", error);
        });

        return () => unsubscribe();
    }, [currentUser?.uid]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (id) => {
        try {
            const notifRef = doc(db, "notifications", id);
            await updateDoc(notifRef, { read: true });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "notifications", id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const markAllAsRead = async () => {
        const unreadDocs = notifications.filter(n => !n.read);
        if (unreadDocs.length === 0) return;

        try {
            const batch = writeBatch(db);

            unreadDocs.forEach(n => {
                const docRef = doc(db, "notifications", n.id);
                batch.update(docRef, { read: true });
            });

            await batch.commit();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleBellClick = () => {
        if (!showNotifications) {
            // About to open, mark all as read
            markAllAsRead();
        }
        setShowNotifications(!showNotifications);
    };


    return (
        <nav className="sticky top-0 z-40 w-full flex items-center justify-between mb-5 rounded-xl bg-transparent">

            <h2 className="text-xl font-semibold text-gray-700">
                {PageTitle}
            </h2>

            {/* <div className="relative hidden md:block">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0CBBAA] text-xl" />
                <SearchInput placeholder="Search for ..." width="w-[350px]" />
            </div> */}

            <div className="flex items-center gap-4">
               {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={handleBellClick}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <FaBell className="text-gray-600 text-xl" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100]">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-semibold text-gray-700">Notifications</h3>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.slice(0, 5).map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <div className={`mt-2 w-2 h-2 rounded-full shrink-0 ${notif.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />

                                            <div className="flex-1">
                                                <h4 className={`text-sm font-semibold mb-1 ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h4>
                                                <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                                                <span className="text-[10px] text-gray-400 mt-2 block">
                                                    {notif.timestamp?.toDate ? notif.timestamp.toDate().toLocaleString() : 'Just now'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => deleteNotification(e, notif.id)}
                                                className="self-start p-1  text-red-400 hover:text-red-500 transition-colors "
                                            >
                                                <FaTrash size={15} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>



                <div className="w-10 h-10 rounded-[10px] bg-white grid place-items-center overflow-hidden ">
                    <img
                        src={currentUser?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex items-center gap-3  border-white/20">

                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-gray-600">
                            {currentUser?.fullName || "Guest User"}
                        </p>

                    </div>

                </div>
            </div>
        </nav>
    );
}