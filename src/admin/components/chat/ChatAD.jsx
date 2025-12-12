import React, { useEffect, useState } from "react";
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

const storage = getStorage();

export default function ChatAD() {
    const { currentUser } = useSelector((state) => state.auth);


    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "messages"), (snapshot) => {
            let users = [];
            snapshot.forEach((d) => users.push({ id: d.id, ...d.data() }));

            setUsersList(users);
        });

        return () => unsub();
    }, []);

    // 🔥 Listener الصحيح للرسائل — مبني على selectedUser فقط
    useEffect(() => {
        if (!selectedUser) return;

        const q = query(
            collection(db, "messages", selectedUser.id, "messages"),
            orderBy("createdAt")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            let msgs = [];
            snapshot.forEach((d) => msgs.push({ id: d.id, ...d.data() }));
            setMessages(msgs);
        });

        return () => unsub();
    }, [selectedUser]);

    const sendMessage = async () => {
        if (!newMessage.trim() && !file) return;
        if (!selectedUser) return;

        let fileUrl = "";
        let fileName = "";

        if (file) {
            const fileRef = ref(storage, `chatFiles/${selectedUser.id}/${file.name}`);
            await uploadBytes(fileRef, file);
            fileUrl = await getDownloadURL(fileRef);
            fileName = file.name;
        }

        await addDoc(collection(db, "messages", selectedUser.id, "messages"), {
            text: newMessage,
            senderId: "admin",
            senderAvatar: currentUser?.profilePic,
            fileUrl,
            fileName,
            createdAt: serverTimestamp(),
        });

        setNewMessage("");
        setFile(null);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="flex h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">

            <div className="w-1/4 border-r p-3 overflow-y-auto">
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

                            <span className="font-medium">{user.name || user.id}</span>

                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="border-b p-3 flex items-center gap-3">
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
                                        {msg.text}

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
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
