


// "use client";
// import React, { useContext, useEffect, useState } from "react";



// import { useRouter } from "next/navigation";
// import { ChatContext } from '@/app/src/context/chatcontext';

// export default function page({ from, to, callType = "video" }) {
//     const { socket, incomingUser } = useContext(ChatContext);
//     const router = useRouter();

//     const [dots, setDots] = useState(".");

//     // Navigate to video call screen when call is accepted
//     // useEffect(() => {
//     //     if (setcurrenuser) {
//     //         console.log("Call ongoing, navigating to video room");
//     //         router.push(`/videoroom?userId=${to}`);
//     //         setsetcurrenuser(null);
//     //     }
//     // }, [setcurrenuser, to, router, setsetcurrenuser]);

//     // Calling animation dots
//     useEffect(() => {
//         const i = setInterval(() => {
//             setDots((d) => (d.length < 3 ? d + "." : "."));
//         }, 500);
//         return () => clearInterval(i);
//     }, []);

//     const handleCancel = () => {
//         socket.emit("end-call", { to, from });
//         router.back();
//     };

//     return (
//         <div style={styles.container}>
//             {/* CALL TYPE ICON */}
//             <div style={styles.icon}>{callType === "video" ? "📹" : "📞"}</div>

//             {/* USER AVATAR */}
//             <img
//                 src="https://placekitten.com/200/200"
//                 alt="avatar"
//                 style={styles.avatar}
//             />

//             {/* TEXT */}
//             <div style={styles.callingText}>
//                 {from} is calling {to}{dots}
//             </div>

//             <div style={styles.subText}>
//                 {callType === "video" ? "Video call" : "Audio call"}
//             </div>

//             {/* BUTTONS */}
//             <div style={styles.buttons}>
//                 <button style={styles.endBtn} onClick={handleCancel}>
//                     📞
//                 </button>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     container: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 20,
//         height: "100vh",
//         backgroundColor: "#000",
//         color: "#fff",
//     },
//     icon: { fontSize: 60, color: "#22C55E" },
//     avatar: { width: 140, height: 140, borderRadius: "50%", border: "2px solid #22C55E" },
//     callingText: { fontSize: 20, fontWeight: 600, marginTop: 10 },
//     subText: { fontSize: 14, color: "#9CA3AF" },
//     buttons: { marginTop: 50, display: "flex", gap: 20 },
//     endBtn: {
//         width: 70,
//         height: 70,
//         borderRadius: "50%",
//         backgroundColor: "#EF4444",
//         color: "#fff",
//         fontSize: 24,
//         border: "none",
//         cursor: "pointer",
//     },
// };









"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatContext } from "@/app/src/context/chatcontext";

export default function CallPage({ from, to, callType = "video" }) {
    const { socket, theme } = useContext(ChatContext);
    const router = useRouter();

    const [dots, setDots] = useState(".");

    // Calling animation
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
            style={{
                ...styles.container,
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                color: isDark ? "#ffffff" : "#0f172a",
            }}
        >
            {/* CALL TYPE ICON */}
            <div
                style={{
                    ...styles.icon,
                    color: "#22c55e",
                }}
            >
                {callType === "video" ? "📹" : "📞"}
            </div>

            {/* USER AVATAR */}
            <img
                src="https://placekitten.com/200/200"
                alt="avatar"
                style={{
                    ...styles.avatar,
                    borderColor: "#22c55e",
                    backgroundColor: isDark ? "#020617" : "#ffffff",
                }}
            />

            {/* TEXT */}
            <div style={styles.callingText}>
                <strong>{from}</strong> is calling{" "}
                <strong>{to}</strong>
                {dots}
            </div>

            <div
                style={{
                    ...styles.subText,
                    color: isDark ? "#94a3b8" : "#64748b",
                }}
            >
                {callType === "video" ? "Video call" : "Audio call"}
            </div>

            {/* BUTTONS */}
            <div style={styles.buttons}>
                <button
                    style={styles.endBtn}
                    onClick={handleCancel}
                    title="End call"
                >
                    📞
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        height: "100vh",
        transition: "background 0.3s, color 0.3s",
    },
    icon: {
        fontSize: 60,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: "50%",
        border: "2px solid",
        objectFit: "cover",
    },
    callingText: {
        fontSize: 20,
        fontWeight: 600,
        marginTop: 10,
        textAlign: "center",
    },
    subText: {
        fontSize: 14,
    },
    buttons: {
        marginTop: 50,
        display: "flex",
        gap: 20,
    },
    endBtn: {
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: "#ef4444",
        color: "#fff",
        fontSize: 24,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
    },
};
