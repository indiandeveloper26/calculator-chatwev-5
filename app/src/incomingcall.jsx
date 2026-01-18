"use client";
import React, { useContext, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { FiPhoneCall } from "react-icons/fi"; // audio icon
import { FiVideo } from "react-icons/fi"; // video icon
import { IoClose } from "react-icons/io5"; // reject icon
import { ChatContext } from "./context/chatcontext";
;

export default function IncomingCall() {
    const { incomingCall, incomingUser, setIncomingCall, myUsername, socket } = useContext(ChatContext);
    const router = useRouter();
    const audioRef = useRef(null);

    console.log('incomig call scrren', incomingUser)

    // Play ringtone
    useEffect(() => {
        if (incomingCall) {
            const audio = new Audio("/ringtone.mp3");
            audio.loop = true;
            audio.play().catch(err => console.log("Audio play failed:", err));
            audioRef.current = audio;
        } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [incomingCall]);

    console.log('inocmig type,user ', incomingUser)

    const acceptCall = () => {


        console.log('icoming user and type', incomingUser)
        console.log('call ac[ected and do now')
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        console.log('call ac[ected and do now')
        setIncomingCall(null);
        socket.emit("accept-call", { from: myUsername, to: incomingUser.from, type: incomingUser.callType });
        socket.emit("join_room", { roomId: incomingUser.roomId });
        // Route according to type
        if (incomingUser.callType === "video") {
            router.push(`/chatlist/${incomingUser}/callui/videocall`);
        } else {
            router.push(`/chatlist/auidocall/sahil`);
        }


    };

    const rejectCall = () => {

        console.log('callend now')
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        console.log('rject usr', incomingUser)

        socket.emit("end-call", { from: myUsername, to: incomingUser.from });
        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    // Choose icon based on call type
    const CallIcon = incomingCall.type === "video" ? FiVideo : FiPhoneCall;

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <div style={styles.iconWrapper}>
                    <CallIcon size={48} color={incomingCall.type === "video" ? "#3B82F6" : "#10B981"} />
                </div>
                <h2 style={styles.title}>
                    {incomingCall.from} is callingggg
                </h2>
                <p style={styles.subtitle}>
                    {incomingUser.callType === "video" ? "Video Call" : "Audio Call"}
                </p>
                <div style={styles.buttons}>
                    <button style={{ ...styles.button, ...styles.accept }} onClick={acceptCall}>
                        <FiPhoneCall size={20} /> Accept
                    </button>
                    <button style={{ ...styles.button, ...styles.reject }} onClick={rejectCall}>
                        <IoClose size={20} /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

// Styles
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    card: {
        backgroundColor: "#fff",
        padding: "30px 20px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "400px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    },
    iconWrapper: {
        marginBottom: "15px",
    },
    title: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "5px",
    },
    subtitle: {
        fontSize: "16px",
        color: "#555",
        marginBottom: "20px",
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
    },
    button: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px",
        borderRadius: "10px",
        color: "#fff",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px",
        transition: "0.2s ease",
    },
    accept: {
        backgroundColor: "#4CAF50",
    },
    reject: {
        backgroundColor: "#EF4444",
    },
};
