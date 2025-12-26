

"use client";

import api from "@/app/apicall";
import { ChatContext } from "@/app/context/chatcontext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUserCircle, FaCamera, FaPhone, FaVideo, FaEnvelope } from "react-icons/fa";

export default function ChatRoom({ userId }) {
    const { id } = useParams();

    const {
        messages,
        myUsername,
        sendMessage,
        onlineUsers,
        socket,
        typingUser,
    } = useContext(ChatContext);

    const [input, setInput] = useState("");
    const [previewImg, setPreviewImg] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef();
    const messagesEndRef = useRef();
    const router = useRouter();

    // Filter only selected chat messages
    const filtered = messages.filter(
        (m) =>
            (m.from === myUsername && m.to === id) ||
            (m.from === id && m.to === myUsername)
    );

    // Show typing indicator
    const displayMessages =
        typingUser === id
            ? [...filtered, { id: "typing", from: id, message: "" }]
            : filtered;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [displayMessages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(id, input.trim(), "text");
        setInput("");
    };

    const handleTyping = (text) => {
        setInput(text);
        if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
    };

    const pickImage = (e) => {
        const file = e.target.files[0];
        if (file) uploadImage(file);
    };

    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append("file", image);

        setUploadLoading(true);
        try {
            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.url) {
                sendMessage(id, res.data.url, "image");
            }
        } catch (err) {
            console.error("Image Upload Error:", err);
        }

        setUploadLoading(false);
    };




    // ✅ New handlers for video, audio, OTP
    const handleVideoCall = () => {

        socket.emit("call-user", {
            from: myUsername, to: id, callType: "video"
        })
        console.log("Start video call with:", id);

        router.push(`/chatlist/${id}/callui`);
    };

    const handleAudioCall = () => {
        console.log("Start audio call with:", id);
        router.push(`/audiocall/${id}`);
    };

    const handleOTP = () => {
        console.log("Send OTP to:", id);
        // Example API call
        // api.post("/send-otp", { user: id });
    };

    return (
        <div style={{ height: "100vh", background: "#111827", display: "flex", flexDirection: "column" }}>
            {/* HEADER */}
            <div style={{ padding: 14, background: "#1F2937", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => window.history.back()} style={{ color: "#fff", marginRight: 10 }}>⬅</button>
                    <FaUserCircle size={42} color="#9CA3AF" />
                    <div style={{ marginLeft: 10 }}>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>{id}</p>
                        <span style={{ color: onlineUsers.includes(id) ? "#4ade80" : "#9CA3AF", fontSize: 13 }}>
                            {onlineUsers.includes(id) ? "● Online" : "○ Offline"}
                        </span>
                    </div>
                </div>

                {/* Video / Audio / OTP Buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                    <FaVideo size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleVideoCall} title="Video Call" />
                    <FaPhone size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleAudioCall} title="Audio Call" />
                    <FaEnvelope size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleOTP} title="Send OTP" />
                </div>
            </div>

            {/* MESSAGES */}
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {displayMessages.map((msg, i) => {
                    const isMine = msg.from === myUsername;
                    const isTyping = msg.id === "typing";

                    return (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: isMine ? "flex-end" : "flex-start",
                                marginBottom: 6,
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "75%",
                                    background: isMine ? "#10B981" : "#2D2D2D",
                                    padding: 10,
                                    borderRadius: 14,
                                    color: "#fff",
                                }}
                            >
                                {isTyping ? (
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                ) : msg.type === "image" ? (
                                    <img
                                        src={msg.message}
                                        style={{
                                            maxWidth: 220,
                                            borderRadius: 12,
                                            marginTop: 4,
                                            backgroundColor: "#000",
                                        }}
                                        onClick={() => setPreviewImg(msg.message)}
                                    />
                                ) : (
                                    <p>{msg.message}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {uploadLoading && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                        <div style={{ background: "#10B981", color: "#fff", padding: 10, borderRadius: 14 }}>
                            <span>Uploading image...</span>
                            <div className="spinner"></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT BOX */}
            <div style={{ display: "flex", padding: 10, background: "#1F2937" }}>
                <input type="file" ref={fileInputRef} onChange={pickImage} hidden />
                <button onClick={() => fileInputRef.current.click()} style={{ color: "#10B981", marginRight: 10 }}>
                    <FaCamera size={22} />
                </button>

                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type message..."
                    style={{
                        flex: 1,
                        background: "#374151",
                        borderRadius: 20,
                        padding: "10px 14px",
                        color: "#fff",
                        border: "none",
                        outline: "none",
                    }}
                />

                <button
                    onClick={handleSend}
                    style={{
                        marginLeft: 10,
                        padding: "8px 16px",
                        background: "#10B981",
                        borderRadius: 20,
                        color: "#fff",
                    }}
                >
                    Send
                </button>
            </div>

            {/* IMAGE PREVIEW FULLSCREEN */}
            {previewImg && (
                <div
                    onClick={() => setPreviewImg(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img src={previewImg} style={{ maxWidth: "90%", maxHeight: "90%" }} />
                </div>
            )}
        </div>
    );
}
