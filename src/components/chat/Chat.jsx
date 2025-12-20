
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

        // await setDoc(
        //     doc(db, "messages", userId),
        //     {
        //         name: currentUser?.fullName || currentUser?.name || "",
        //         avatar: currentUser?.profilePic || "",
        //         lastActive: serverTimestamp()
        //     },
        //     { merge: true }
        // );

        await setDoc(
            doc(db, "messages", userId),
            {
                uid: userId,
                name: currentUser?.fullName || "",
                avatar: currentUser?.profilePic || "",
                lastMessage: newMessage || "📎 File",
                lastMessageAt: serverTimestamp(),
                unreadForAdmin: true,
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
    const messagesEndRef = React.useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className="bg-white sm:rounded-xl shadow-lg p-2 sm:p-4 min-h-[85dvh] h-[85dvh] sm:h-[500px] flex flex-col">

            {/* Header */}
            <div className="border-b pb-2 mb-2 flex items-center gap-2 sm:gap-3">
                <img
                    src={Logo}
                    className="w-12 h-12 sm:w-20 sm:h-20 rounded-full"
                />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 px-1 sm:px-2">

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.senderId === userId ? "flex-row-reverse" : "flex-row"
                            }`}
                    >
                        {/* Avatar */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white">
                            <img
                                src={
                                    msg.senderAvatar ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Message */}
                        <div
                            className={`px-3 sm:px-4 py-2 rounded-xl max-w-[95%] sm:max-w-[70%] text-xs sm:text-sm ${msg.senderId === userId
                                ? "bg-[#0f9386] text-white rounded-br-none"
                                : "bg-gray-100 text-gray-700 rounded-bl-none"}`}
                        >
                            {msg.text}

                            {msg.fileUrl && (
                                <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    className="block mt-2 underline text-xs"
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
            <div
                className="sticky bottom-0 pt-2 border-t flex items-center gap-2 bg-white"
            >


                <button
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="text-gray-500 hover:text-[#0f9386]"
                >
                    <FiSmile size={18} />
                </button>

                <label className="cursor-pointer text-gray-500 hover:text-[#0f9386]">
                    <FiPaperclip size={18} />
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
                    className="bg-[#0f9386]  shrink-0  text-white px-4 py-2 rounded-full text-sm"
                >
                    Send
                </button>
            </div>

        </div>
    );
}