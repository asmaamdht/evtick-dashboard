import React from "react";

export default function StageLine() {
    return (
        <div className="w-full flex justify-center mb-6">
            <svg
                width="80%"
                height="40"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,40 Q50,0 100,40"
                    stroke="#0CBBAA"
                    strokeWidth="2"
                    fill="transparent"
                />
            </svg>
        </div>
    );
}