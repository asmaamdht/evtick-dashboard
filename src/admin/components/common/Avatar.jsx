import React, { useState } from "react";

function Avatar({ seed }) {
    const [randomImage] = useState(() => seed || Math.floor(Math.random() * 999999));
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/png?seed=${randomImage}&size=150`;


    return (
        <div className="p-1 rounded-full">
            <img
                src={avatarUrl}
                alt="avatar"
                className="w-12 h-10 rounded-full object-cover"
            />
        </div>
    );
}

export default Avatar;