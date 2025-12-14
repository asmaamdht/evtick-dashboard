
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase.config";
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
import Logo from "../../assets/images/EvTick_Logo.png";
import { useSelector } from "react-redux";
import { setDoc, doc } from "firebase/firestore";


const storage = getStorage();

export default function UserChat() {
    const { currentUser } = useSelector((state) => state.auth);
    const userId = currentUser?.uid;

    const chatId = userId;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);

    // Fetch messages
    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "messages", chatId, "messages"),
            orderBy("createdAt")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            let msgs = [];
            snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });

        return () => unsub();
    }, [userId]);

    const sendMessage = async () => {
        if (!newMessage.trim() && !file) return;

        await setDoc(
            doc(db, "messages", userId),
            {
                name: currentUser?.fullName || currentUser?.name || "",
                avatar: currentUser?.profilePic || "",
                lastActive: serverTimestamp()
            },
            { merge: true }
        );


        let fileUrl = "";
        let fileName = "";

        if (file) {
            const fileRef = ref(storage, `chatFiles/${chatId}/${file.name}`);
            await uploadBytes(fileRef, file);
            fileUrl = await getDownloadURL(fileRef);
            fileName = file.name;
        }

        await addDoc(collection(db, "messages", chatId, "messages"), {
            text: newMessage,
            senderId: userId,
            senderAvatar: currentUser?.profilePic || "",
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
        <div className="bg-white rounded-xl shadow-lg p-4 h-[600px] flex flex-col">

            {/* Header */}
            <div className="border-b pb-0 mb-3 flex items-center gap-3">
                <img src={Logo} className="w-20 h-20 rounded-full" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.senderId === userId ? "flex-row-reverse" : "flex-row"
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
                            className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${msg.senderId === userId
                                ? "bg-[#0f9386] text-white"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {msg.text}

                            {msg.fileUrl && (
                                <a href={msg.fileUrl} target="_blank" className="block mt-2 underline text-xs">
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

            {/* Input */}
            <div className="pt-3 border-t flex items-center gap-3 relative">
                <button onClick={() => setShowEmoji(!showEmoji)} className="text-gray-500 hover:text-[#0f9386]">
                    <FiSmile size={22} />
                </button>

                <label className="cursor-pointer text-gray-500 hover:text-[#0f9386]">
                    <FiPaperclip size={22} />
                    <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                </label>

                {showEmoji && (
                    <div className="absolute bottom-16 left-0 z-50">
                        <EmojiPicker onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)} />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0f9386]"
                />

                <button
                    onClick={sendMessage}
                    className="bg-[#0f9386] text-white px-5 py-2 rounded-lg hover:bg-[#0f8876]"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
