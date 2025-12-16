import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase.config";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiSmile, FiPaperclip } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";

const storage = getStorage();

export default function ChatRoom() {
    const { currentUser } = useSelector((state) => state.auth);


    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showUsersList, setShowUsersList] = useState(false); // للموبايل

    useEffect(() => {
        // سحب المستخدمين الذين لديهم رسائل فقط
        const unsub = onSnapshot(collection(db, "users"), async (snapshot) => {
            // استخدام Promise.all لتحميل جميع المستخدمين دفعة واحدة
            const userPromises = snapshot.docs.map(async (userDoc) => {
                const data = userDoc.data();

                // فحص إذا كان المستخدم لديه رسائل في chats subcollection
                const chatsRef = collection(db, "users", userDoc.id, "chats");
                const chatsSnapshot = await getDocs(chatsRef);

                // إذا كان لديه رسائل، أرجع بياناته مع عدد الرسائل غير المقروءة
                if (!chatsSnapshot.empty) {
                    // حساب الرسائل غير المقروءة (التي لم يرسلها الأدمن وليست مقروءة)
                    const unreadCount = chatsSnapshot.docs.filter(doc => {
                        const msgData = doc.data();
                        return msgData.senderId !== "admin" && !msgData.isRead;
                    }).length;

                    return {
                        id: userDoc.id,
                        name: data.userName || "User",
                        email: data.email || "",
                        avatar: data.profilePic || null,
                        uid: data.uid,
                        unreadCount // إضافة العدد
                    };
                }
                return null;
            });

            // انتظر جميع الفحوصات وازل null
            const usersWithChats = (await Promise.all(userPromises)).filter(user => user !== null);

            // ترتيب المستخدمين: المستخدمين الأحدث أو الذين لديهم رسائل غير مقروءة في الأعلى (اختياري، هنا الترتيب حسب الـ snapshot الأصلي)
            // يمكننا ترتيبهم بحيث يظهر من لديه رسائل غير مقروءة أولاً
            usersWithChats.sort((a, b) => b.unreadCount - a.unreadCount);

            setUsersList(usersWithChats);
        });

        return () => unsub();
    }, []);


    useEffect(() => {
        if (!selectedUser) return;

        // سحب الرسائل من users/{userId}/chats
        const q = query(
            collection(db, "users", selectedUser.id, "chats"),
            orderBy("createdAt")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            let msgs = [];
            const unreadMessagesIds = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({ id: doc.id, ...data });

                // تجميع معرفات الرسائل غير المقروءة والخاصة بالمستخدم (ليس الأدمن)
                if (data.senderId !== "admin" && !data.isRead) {
                    unreadMessagesIds.push(doc.id);
                }
            });
            setMessages(msgs);

            // تحديث حالة الرسائل إلى مقروءة
            if (unreadMessagesIds.length > 0) {
                const markAsRead = async () => {
                    await Promise.all(unreadMessagesIds.map(msgId =>
                        updateDoc(doc(db, "users", selectedUser.id, "chats", msgId), {
                            isRead: true
                        })
                    ));

                    // تحديث القائمة المحلية لتصفير العداد (لتحسين تجربة المستخدم فورياً)
                    setUsersList(prev => prev.map(u =>
                        u.id === selectedUser.id ? { ...u, unreadCount: 0 } : u
                    ));
                };
                markAsRead();
            }
        });

        return () => unsub();
    }, [selectedUser]);

    const sendMessage = async () => {
        try {
            console.log("Send button clicked");
            console.log("Selected User:", selectedUser);
            console.log("New Message:", newMessage);
            console.log("Current User:", currentUser);

            if (!newMessage.trim() && !file) {
                console.log("No message or file");
                return;
            }
            if (!selectedUser) {
                console.log("No user selected");
                return;
            }

            let fileUrl = "";
            let fileName = "";

            if (file) {
                const fileRef = ref(storage, `chatFiles/${selectedUser.id}/${file.name}`);
                await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(fileRef);
                fileName = file.name;
            }

            console.log("Sending message to:", `users/${selectedUser.id}/chats`);

            // إعداد بيانات الرسالة
            const messageData = {
                message: newMessage,
                text: newMessage,
                senderId: "admin",
                senderName: currentUser?.userName || "Admin",
                senderEmail: currentUser?.email || "",
                createdAt: serverTimestamp(),
            };

            // إضافة senderAvatar فقط إذا كان موجود
            if (currentUser?.profilePic) {
                messageData.senderAvatar = currentUser.profilePic;
            }

            // إضافة الملف فقط إذا كان موجود
            if (fileUrl) {
                messageData.fileUrl = fileUrl;
                messageData.fileName = fileName;
            }

            // إرسال الرسالة إلى users/{userId}/chats
            await addDoc(collection(db, "users", selectedUser.id, "chats"), messageData);

            console.log("Message sent successfully!");
            setNewMessage("");
            setFile(null);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message: " + error.message);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="flex h-full bg-white rounded-xl shadow-lg overflow-hidden mt-4">

            {/* قائمة المستخدمين */}
            <div className={`w-full md:w-1/4 border-r p-3 overflow-y-auto ${showUsersList ? 'block' : 'hidden md:block'
                }`}>
                <h3 className="text-lg font-semibold mb-3">Users</h3>

                {usersList.map((user) => (
                    <div
                        key={user.id}
                        className={`p-2 rounded-lg cursor-pointer mb-2 hover:bg-gray-100 ${selectedUser?.id === user.id ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                className="w-10 h-10 rounded-full"
                            />

                            <div className="flex-1">
                                <span className="font-medium block">{user.name || user.id}</span>
                                {/* عرض آخر رسالة أو حالة الاتصال يمكن أن يضاف هنا */}
                            </div>

                            {/* Unread Badge */}
                            {user.unreadCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                                    {user.unreadCount}
                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            {/* منطقة الشات */}
            <div className="flex-1 flex flex-col min-h-0">
                {selectedUser ? (
                    <>
                        {/* Header مع زر toggle للموبايل */}
                        <div className="border-b p-3 flex items-center gap-3">
                            {/* زر toggle للموبايل */}
                            <button
                                onClick={() => setShowUsersList(!showUsersList)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <img
                                src={selectedUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                className="w-10 h-10 rounded-full"
                            />
                            <h3 className="font-semibold">{selectedUser.name}</h3>
                        </div>


                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.senderId === "admin" ? "flex-row-reverse" : "flex-row"
                                        }`}

                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-white">
                                        <img
                                            src={msg.senderAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div
                                        className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${msg.senderId === "admin"
                                            ? "bg-[#0f9386] text-white"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {msg.message || msg.text}

                                        {msg.fileUrl &&
                                            msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                                <img
                                                    src={msg.fileUrl}
                                                    className="mt-2 rounded-lg max-h-60"
                                                    alt=""
                                                />
                                            )}

                                        {msg.fileUrl &&
                                            !msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                                <a href={msg.fileUrl} target="_blank" className="underline text-xs block mt-2">
                                                    📎 {msg.fileName}
                                                </a>
                                            )}

                                        <div className="text-[10px] opacity-70 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <div className="p-3 border-t flex items-center gap-3 relative">
                            <button onClick={() => setShowEmoji(!showEmoji)}>
                                <FiSmile size={22} className="text-gray-600 hover:text-[#0f9386]" />
                            </button>

                            <label className="cursor-pointer">
                                <FiPaperclip size={22} className="text-gray-600 hover:text-[#0f9386]" />
                                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                            </label>

                            {showEmoji && (
                                <div className="absolute bottom-16 left-0 z-50">
                                    <EmojiPicker onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} />
                                </div>
                            )}

                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0f9386] outline-none"
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-[#0f9386] text-white px-5 py-2 rounded-lg hover:bg-[#0f8876]"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 relative">
                        {/* زر toggle للموبايل - يظهر فقط على الشاشات الصغيرة */}
                        <button
                            onClick={() => setShowUsersList(!showUsersList)}
                            className="md:hidden absolute top-4 left-4 p-2 bg-[#0f9386] text-white rounded-lg hover:bg-[#0f8876] shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg">Select a user to start chatting</p>
                        <p className="text-sm mt-2 md:hidden">Tap the menu button to see users</p>
                    </div>
                )}
            </div>
        </div>
    );
}
