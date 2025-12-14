
import React from "react";
import { useNavigate } from "react-router-dom";


function NoEvent() {
    const navigate = useNavigate();

    return (
        <div className="relative  w-[300px] mx-auto mt-5 mr-5">

            <div className="
                absolute top-6 left-2 w-full h-[250px]
                bg-primary rounded-2xl rotate-[4deg]
                flex items-center justify-center text-gray-700 font-semibold
            ">
            </div>

            <div className="
                absolute top-12 left-4 w-full h-[250px]
                bg-gray-200/70 rounded-2xl rotate-[-3deg]
                flex items-center justify-center text-gray-500
            ">
            </div>

            <div className="relative bg-white rounded-2xl shadow-xl p-5 w-full z-10 h-[250px]">

                <div className="flex items-center gap-4">

                    <img
                        src="src/assets/images/person.png"
                        alt="profile"
                        className=" object-cover w-20 h-52 "
                    />

                    <div>
                        <h2 className="text-xl font-bold text-textColor">No Events Today</h2>
                        <p className="text-gray-500 text-sm mt-1">Check upcoming events</p>
                        <div className="mt-8">
                            <button
                                onClick={() => navigate("/dashboard/manageEvents")}
                                className="
                                    w-full bg-primary text-white rounded-lg py-2
                                    font-semibold hover:bg-primary/80 transition
                                "
                            >
                                Explore Events
                            </button>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}


export default NoEvent;