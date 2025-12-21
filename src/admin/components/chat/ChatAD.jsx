import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../firebase/firebase.config";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiSmile, FiPaperclip } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { where, doc, setDoc } from "firebase/firestore";


const storage = getStorage();

export default function ChatAD() {
    const { currentUser } = useSelector((state) => state.auth);


    const [organizers, setOrganizers] = useState([]);
    const [chats, setChats] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const messagesEndRef = useRef(null);




    useEffect(() => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "organizer")
    );

    const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
        }));
        setOrganizers(list);
    });

    return () => unsub();
}, []);


   useEffect(() => {
    const q = query(
        collection(db, "messages"),
        orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
        }));
        setChats(list);
    });

    return () => unsub();
}, []);



    useEffect(() => {
        if (!selectedUser) return;

        const q = query(
            collection(db, "messages", selectedUser.uid, "messages"),
            orderBy("createdAt")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            let msgs = [];
            snapshot.forEach((d) => msgs.push({ id: d.id, ...d.data() }));
            setMessages(msgs);
        });

        return () => unsub();
    }, [selectedUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, selectedUser]);


    const sendMessage = async () => {
        if (!newMessage.trim() && !file) return;
        if (!selectedUser) return;

        let fileUrl = "";
        let fileName = "";

        if (file) {
            const fileRef = ref(storage, `chatFiles/${selectedUser.uid}/${file.name}`);
            await uploadBytes(fileRef, file);
            fileUrl = await getDownloadURL(fileRef);
            fileName = file.name;
        }

        await addDoc(
            collection(db, "messages", selectedUser.uid, "messages"),
            {
                text: newMessage || "",
                senderId: "admin",
                senderAvatar:
                    currentUser?.profilePic ??
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                fileUrl: fileUrl || "",
                fileName: fileName || "",
                createdAt: serverTimestamp(),
            }
        );
   
        await setDoc(
            doc(db, "messages", selectedUser.uid),
            {
                lastMessage: newMessage || "📎 File",
                lastMessageAt: serverTimestamp(),
                unreadForAdmin: false, 
            },
            { merge: true }
        );


        setNewMessage("");
        setFile(null);

    };


    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
    // merge organizers + chats
const mergedUsers = organizers.map((org) => {
    const chat = chats.find((c) => c.uid === org.uid);

    return {
        uid: org.uid,
        name: org.fullName,
        email: org.email,
        avatar: org.profilePic,
        lastMessage: chat?.lastMessage || "",
        lastMessageAt: chat?.lastMessageAt || null,
        unreadForAdmin: chat?.unreadForAdmin || false,
        hasChat: !!chat,
    };
});

// sort users
const sortedUsers = [...mergedUsers].sort((a, b) => {
    if (a.lastMessageAt && b.lastMessageAt) {
        return b.lastMessageAt.toMillis() - a.lastMessageAt.toMillis();
    }
    if (a.lastMessageAt) return -1;
    if (b.lastMessageAt) return 1;
    return a.name.localeCompare(b.name);
});

// filter (search)
const filteredUsers = sortedUsers.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    return (
        user.name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)
    );
});


    return (
       <div className="flex w-full h-[100vh] sm:h-[80vh] bg-white rounded-none sm:rounded-xl shadow-lg overflow-hidden">


            {/*USERS LIST */}
            <div
                className={`w-full sm:w-1/4 border-r flex flex-col ${selectedUser ? "hidden sm:flex" : "flex"}`}
            >
                {/* Header */}
                <div className="p-3 border-b bg-white">
                    <h3 className="text-lg font-semibold mb-3">Organizers</h3>

                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0f9386] outline-none"
                    />
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-3">
                  
                    {filteredUsers.map((user) => (
                        <div
                            key={user.uid}
                            onClick={() => {
                                setSelectedUser(user);

                                setDoc(
                                    doc(db, "messages", user.uid),
                                    { unreadForAdmin: false },
                                    { merge: true }
                                );
                            }}
                            className="p-2 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                        {user.lastMessage}
                                    </p>
                                </div>
                            </div>

                            {/* Unread badge */}
                            {user.unreadForAdmin && (
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </div>
                    ))}

                </div>
            </div>

            {/*CHAT AREA */}
            <div
                className={`flex flex-col w-full sm:flex-1 ${!selectedUser ? "hidden sm:flex" : "flex"}`}
            >

                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div
                            className="border-b p-3 flex items-center gap-3 bg-white sticky top-0 z-10">

                            {/* Back button mobile */}
                            <button
                                className="sm:hidden text-gray-600 text-lg"
                                onClick={() => setSelectedUser(null)}
                            >
                                ←
                            </button>

                            <img
                                src={
                                    selectedUser.avatar ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                className="w-10 h-10 rounded-full"
                            />
                            <h3 className="font-semibold">{selectedUser.name}</h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.senderId === "admin"
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                msg.senderAvatar ||
                                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div
                                        className={`px-3 sm:px-4 py-2 rounded-xl max-w-[85%] sm:max-w-[70%] text-sm ${msg.senderId === "admin" ? "bg-[#0f9386] text-white" : "bg-gray-100 text-gray-700"}`} >
                                        {msg.text}

                                        {msg.fileUrl &&
                                            msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                                <img
                                                    src={msg.fileUrl}
                                                    className="mt-2 rounded-lg max-h-60"
                                                />
                                            )}

                                        {msg.fileUrl &&
                                            !msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                                <a
                                                    href={msg.fileUrl}
                                                    target="_blank"
                                                    className="underline text-xs block mt-2"
                                                >
                                                    📎 {msg.fileName}
                                                </a>
                                            )}

                                        <div className="text-[10px] opacity-70 mt-1 text-right">
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t flex items-end gap-2 bg-white sticky bottom-0">
                            <button onClick={() => setShowEmoji(!showEmoji)}>
                                <FiSmile size={18} className="text-gray-600" />
                            </button>

                            <label className="cursor-pointer">
                                <FiPaperclip size={18} className="text-gray-600" />
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>

                            {showEmoji && (
                                <div className="fixed bottom-20 left-[80px] sm:left-[300px] z-[9999]">
                                    <EmojiPicker
                                        width={300}
                                        height={350}
                                        onEmojiClick={(emojiData) =>
                                            setNewMessage((prev) => prev + emojiData.emoji)
                                        }
                                    />
                                </div>
                            )}

                            <textarea
                                rows={1}
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                }}
                                className="flex-1 min-w-0 resize-none overflow-hidden border rounded-2xl px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-[#0f9386] outline-none max-h-32"
                            />

                            <button
                                onClick={sendMessage}
                                className="shrink-0 bg-[#0f9386] text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );

}
