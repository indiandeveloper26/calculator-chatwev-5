"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatContext } from "@/app/src/context/chatcontext";

export default function CallPage({ from, to, callType = "video" }) {
    const { socket, theme } = useContext(ChatContext);
    const router = useRouter();
    const [dots, setDots] = useState(".");

    /* calling animation */
    useEffect(() => {
        const i = setInterval(() => {
            setDots((d) => (d.length < 3 ? d + "." : "."));
        }, 500);
        return () => clearInterval(i);
    }, []);

    const handleCancel = () => {
        socket.emit("end-call", { to, from });
        router.back();
    };

    const isDark = theme === "dark";

    return (
        <div
            className={`
                h-screen flex flex-col items-center justify-center
                transition-colors duration-300
                ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
            `}
        >
            {/* CALL ICON */}
            <div className="text-6xl mb-4 text-green-500 animate-pulse">
                {callType === "video" ? "📹" : "📞"}
            </div>

            {/* AVATAR */}
            <div className="relative">
                <img
                    src="https://placekitten.com/300/300"
                    alt="avatar"
                    className={`
                        w-36 h-36 rounded-full object-cover
                        border-4 border-green-500
                        shadow-xl
                        ${isDark ? "bg-slate-900" : "bg-white"}
                    `}
                />
                <span className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-20"></span>
            </div>

            {/* TEXT */}
            <div className="mt-6 text-center">
                <p className="text-xl font-semibold">
                    {from} <span className="font-normal">is calling</span> {to}
                    {dots}
                </p>
                <p
                    className={`
                        mt-1 text-sm
                        ${isDark ? "text-slate-400" : "text-slate-500"}
                    `}
                >
                    {callType === "video" ? "Video call" : "Audio call"}
                </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-16 flex items-center gap-10">
                {/* END CALL */}
                <button
                    onClick={handleCancel}
                    className="
                        w-16 h-16 rounded-full bg-red-500
                        flex items-center justify-center
                        text-white text-2xl
                        shadow-lg shadow-red-500/40
                        hover:bg-red-600 active:scale-95
                        transition
                    "
                    title="End Call"
                >
                    📞
                </button>
            </div>
        </div>
    );
}
