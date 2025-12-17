import React from "react";

function SpecialOfferCard({ image, title, subtitle, buttonText, bgColor }) {
    return (
        <div
            className={`flex items-center justify-between rounded-xl shadow-lg ${bgColor}`}
        >
            <div className="flex flex-col gap-2 pl-10 pr-7">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{subtitle}</p>
                <button className="mt-2 px-4 py-2 bg-white text-primary text-sm rounded  transition">
                    {buttonText}
                </button>
            </div>

            <div className=" h-40">
                <img
                    src={image}
                    alt="Admin"
                    className="w-full h-full object-contain rounded-lg"
                />
            </div>
        </div>
    );
}

export default SpecialOfferCard;