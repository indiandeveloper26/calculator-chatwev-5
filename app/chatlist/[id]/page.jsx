

// // "use client";

// // import api from '../../src/api'

// // import React, { useContext, useState, useEffect, useRef } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { FaUserCircle, FaCamera, FaPhone, FaVideo, FaEnvelope } from "react-icons/fa";
// // import { ChatContext } from '@/app/src/context/chatcontext';





// // export default function ChatRoom({ userId }) {
// //     const { id } = useParams();

// //     const {
// //         messages,
// //         myUsername,
// //         sendMessage,
// //         onlineUsers,
// //         socket,
// //         typingUser,
// //     } = useContext(ChatContext);

// //     const [input, setInput] = useState("");
// //     const [previewImg, setPreviewImg] = useState(null);
// //     const [uploadLoading, setUploadLoading] = useState(false);
// //     const fileInputRef = useRef();
// //     const messagesEndRef = useRef();
// //     const router = useRouter();




// //     useEffect(() => {

// //         socket.emit("setUsername", myUsername);
// //     }, [])


// //     // Filter only selected chat messages
// //     const filtered = messages.filter(
// //         (m) =>
// //             (m.from === myUsername && m.to === id) ||
// //             (m.from === id && m.to === myUsername)
// //     );

// //     // Show typing indicator
// //     const displayMessages =
// //         typingUser === id
// //             ? [...filtered, { id: "typing", from: id, message: "" }]
// //             : filtered;

// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }, [displayMessages]);

// //     const handleSend = () => {
// //         if (!input.trim()) return;
// //         sendMessage(id, input.trim(), "text");
// //         setInput("");
// //     };

// //     const handleTyping = (text) => {
// //         setInput(text);
// //         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
// //     };

// //     const pickImage = (e) => {
// //         const file = e.target.files[0];
// //         if (file) uploadImage(file);
// //     };

// //     const uploadImage = async (image) => {
// //         const formData = new FormData();
// //         formData.append("file", image);

// //         setUploadLoading(true);
// //         try {
// //             const res = await api.post("/upload", formData, {
// //                 headers: { "Content-Type": "multipart/form-data" },
// //             });

// //             if (res.data.url) {
// //                 sendMessage(id, res.data.url, "image");
// //             }
// //         } catch (err) {
// //             console.error("Image Upload Error:", err);
// //         }

// //         setUploadLoading(false);
// //     };




// //     // ✅ New handlers for video, audio, OTP
// //     const handleVideoCall = () => {

// //         socket.emit("call-user", {
// //             from: myUsername, to: id, callType: "video", roomId: "123456"
// //         })
// //         console.log("Start video call with:", id);

// //         router.push(`/chatlist/${id}/callui`);
// //     };

// //     const handleAudioCall = () => {
// //         console.log("Start audio call with:", id);
// //         router.push(`/audiocall/${id}`);
// //     };

// //     const handleOTP = () => {
// //         console.log("Send OTP to:", id);
// //         // Example API call
// //         // api.post("/send-otp", { user: id });
// //     };

// //     return (
// //         <div style={{ height: "100vh", background: "#111827", display: "flex", flexDirection: "column" }}>
// //             {/* HEADER */}
// //             <div style={{ padding: 14, background: "#1F2937", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// //                 <div style={{ display: "flex", alignItems: "center" }}>
// //                     <button onClick={() => window.history.back()} style={{ color: "#fff", marginRight: 10 }}>⬅</button>
// //                     <FaUserCircle size={42} color="#9CA3AF" />
// //                     <div style={{ marginLeft: 10 }}>
// //                         <p style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>{id}</p>
// //                         <span style={{ color: onlineUsers.includes(id) ? "#4ade80" : "#9CA3AF", fontSize: 13 }}>
// //                             {onlineUsers.includes(id) ? "● Online" : "○ Offline"}
// //                         </span>
// //                     </div>
// //                 </div>

// //                 {/* Video / Audio / OTP Buttons */}
// //                 <div style={{ display: "flex", gap: 10 }}>
// //                     <FaVideo size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleVideoCall} title="Video Call" />
// //                     <FaPhone size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleAudioCall} title="Audio Call" />
// //                     <FaEnvelope size={20} color="#10B981" style={{ cursor: "pointer" }} onClick={handleOTP} title="Send OTP" />
// //                 </div>
// //             </div>

// //             {/* MESSAGES */}
// //             <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
// //                 {displayMessages.map((msg, i) => {
// //                     const isMine = msg.from === myUsername;
// //                     const isTyping = msg.id === "typing";

// //                     return (
// //                         <div
// //                             key={i}
// //                             style={{
// //                                 display: "flex",
// //                                 justifyContent: isMine ? "flex-end" : "flex-start",
// //                                 marginBottom: 6,
// //                             }}
// //                         >
// //                             <div
// //                                 style={{
// //                                     maxWidth: "75%",
// //                                     background: isMine ? "#10B981" : "#2D2D2D",
// //                                     padding: 10,
// //                                     borderRadius: 14,
// //                                     color: "#fff",
// //                                 }}
// //                             >
// //                                 {isTyping ? (
// //                                     <div style={{ display: "flex", gap: 4 }}>
// //                                         <div className="dot"></div>
// //                                         <div className="dot"></div>
// //                                         <div className="dot"></div>
// //                                     </div>
// //                                 ) : msg.type === "image" ? (
// //                                     <img
// //                                         src={msg.message}
// //                                         style={{
// //                                             maxWidth: 220,
// //                                             borderRadius: 12,
// //                                             marginTop: 4,
// //                                             backgroundColor: "#000",
// //                                         }}
// //                                         onClick={() => setPreviewImg(msg.message)}
// //                                     />
// //                                 ) : (
// //                                     <p>{msg.message}</p>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     );
// //                 })}

// //                 {uploadLoading && (
// //                     <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
// //                         <div style={{ background: "#10B981", color: "#fff", padding: 10, borderRadius: 14 }}>
// //                             <span>Uploading image...</span>
// //                             <div className="spinner"></div>
// //                         </div>
// //                     </div>
// //                 )}

// //                 <div ref={messagesEndRef} />
// //             </div>

// //             {/* INPUT BOX */}
// //             <div style={{ display: "flex", padding: 10, background: "#1F2937" }}>
// //                 <input type="file" ref={fileInputRef} onChange={pickImage} hidden />
// //                 <button onClick={() => fileInputRef.current.click()} style={{ color: "#10B981", marginRight: 10 }}>
// //                     <FaCamera size={22} />
// //                 </button>

// //                 <input
// //                     value={input}
// //                     onChange={(e) => handleTyping(e.target.value)}
// //                     placeholder="Type message..."
// //                     style={{
// //                         flex: 1,
// //                         background: "#374151",
// //                         borderRadius: 20,
// //                         padding: "10px 14px",
// //                         color: "#fff",
// //                         border: "none",
// //                         outline: "none",
// //                     }}
// //                 />

// //                 <button
// //                     onClick={handleSend}
// //                     style={{
// //                         marginLeft: 10,
// //                         padding: "8px 16px",
// //                         background: "#10B981",
// //                         borderRadius: 20,
// //                         color: "#fff",
// //                     }}
// //                 >
// //                     Send
// //                 </button>
// //             </div>

// //             {/* IMAGE PREVIEW FULLSCREEN */}
// //             {previewImg && (
// //                 <div
// //                     onClick={() => setPreviewImg(null)}
// //                     style={{
// //                         position: "fixed",
// //                         inset: 0,
// //                         backgroundColor: "rgba(0,0,0,0.9)",
// //                         display: "flex",
// //                         justifyContent: "center",
// //                         alignItems: "center",
// //                     }}
// //                 >
// //                     <img src={previewImg} style={{ maxWidth: "90%", maxHeight: "90%" }} />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }






// "use client";

// import api from '../../src/api'
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { FaUserCircle, FaCamera, FaPhone, FaVideo, FaEnvelope } from "react-icons/fa";
// import { ChatContext } from '@/app/src/context/chatcontext';
// import { animate } from "motion";
// export default function ChatRoom({ userId }) {
//     const { id } = useParams();

//     const {
//         messages,
//         myUsername,
//         sendMessage,
//         onlineUsers,
//         socket,
//         typingUser,
//         theme,               // ✅ added
//     } = useContext(ChatContext);

//     const isDark = theme === "dark"; // ✅ added

//     const [input, setInput] = useState("");
//     const [previewImg, setPreviewImg] = useState(null);
//     const [uploadLoading, setUploadLoading] = useState(false);
//     const fileInputRef = useRef();
//     const messagesEndRef = useRef();
//     const router = useRouter();

//     useEffect(() => {
//         socket.emit("setUsername", myUsername);
//     }, []);

//     const filtered = messages.filter(
//         (m) =>
//             (m.from === myUsername && m.to === id) ||
//             (m.from === id && m.to === myUsername)
//     );

//     const displayMessages =
//         typingUser === id
//             ? [...filtered, { id: "typing", from: id, message: "" }]
//             : filtered;

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [displayMessages]);

//     const handleSend = () => {
//         if (!input.trim()) return;
//         sendMessage(id, input.trim(), "text");
//         setInput("");
//     };

//     const handleTyping = (text) => {
//         setInput(text);
//         if (text.trim()) socket.emit("typing", { from: myUsername, to: id });
//     };

//     const pickImage = (e) => {
//         const file = e.target.files[0];
//         if (file) uploadImage(file);
//     };

//     const uploadImage = async (image) => {
//         const formData = new FormData();
//         formData.append("file", image);

//         setUploadLoading(true);
//         try {
//             const res = await api.post("/upload", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             if (res.data.url) {
//                 sendMessage(id, res.data.url, "image");
//             }
//         } catch (err) {
//             console.error("Image Upload Error:", err);
//         }

//         setUploadLoading(false);
//     };

//     const handleVideoCall = () => {
//         socket.emit("call-user", {
//             from: myUsername, to: id, callType: "video", roomId: "123456"
//         });
//         router.push(`/chatlist/${id}/callui`);
//     };

//     const handleAudioCall = () => {
//         router.push(`/audiocall/${id}`);
//     };

//     const handleOTP = () => {
//         console.log("Send OTP to:", id);
//     };

//     return (
//         <div style={{
//             height: "100vh",
//             background: isDark ? "#111827" : "#f1f5f9",
//             display: "flex",
//             flexDirection: "column"
//         }}>
//             {/* HEADER */}
//             <div style={{
//                 padding: 14,
//                 background: isDark ? "#1F2937" : "#ffffff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 borderBottom: isDark ? "none" : "1px solid #e5e7eb"
//             }}>
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <button onClick={() => window.history.back()}
//                         style={{ color: isDark ? "#fff" : "#111", marginRight: 10 }}>
//                         ⬅
//                     </button>

//                     <FaUserCircle size={42} color={isDark ? "#9CA3AF" : "#64748b"} />

//                     <div style={{ marginLeft: 10 }}>
//                         <p style={{
//                             color: isDark ? "#fff" : "#0f172a",
//                             fontWeight: 600,
//                             fontSize: 16
//                         }}>
//                             {id}
//                         </p>
//                         <span style={{
//                             color: onlineUsers.includes(id) ? "#4ade80" : (isDark ? "#9CA3AF" : "#64748b"),
//                             fontSize: 13
//                         }}>
//                             {onlineUsers.includes(id) ? "● Online" : "○ Offline"}
//                         </span>
//                     </div>
//                 </div>

//                 <div style={{ display: "flex", gap: 10 }}>
//                     <FaVideo size={20} color="#10B981" onClick={handleVideoCall} />
//                     <FaPhone size={20} color="#10B981" onClick={handleAudioCall} />
//                     <FaEnvelope size={20} color="#10B981" onClick={handleOTP} />
//                 </div>
//             </div>

//             {/* MESSAGES */}
//             <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
//                 {displayMessages.map((msg, i) => {
//                     const isMine = msg.from === myUsername;
//                     const isTyping = msg.id === "typing";

//                     return (
//                         <div key={i} style={{
//                             display: "flex",
//                             justifyContent: isMine ? "flex-end" : "flex-start",
//                             marginBottom: 6,
//                         }}>
//                             <div style={{
//                                 maxWidth: "75%",
//                                 background: isMine
//                                     ? "#10B981"
//                                     : (isDark ? "#2D2D2D" : "#e5e7eb"),
//                                 padding: 10,
//                                 borderRadius: 14,
//                                 color: isMine ? "#fff" : (isDark ? "#fff" : "#111"),
//                             }}>
//                                 {isTyping ? "typing..." : msg.type === "image" ? (
//                                     <img src={msg.message}
//                                         style={{ maxWidth: 220, borderRadius: 12 }}
//                                         onClick={() => setPreviewImg(msg.message)} />
//                                 ) : (
//                                     <p>{msg.message}</p>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* INPUT */}
//             <div style={{
//                 display: "flex",
//                 padding: 10,
//                 background: isDark ? "#1F2937" : "#ffffff",
//                 borderTop: isDark ? "none" : "1px solid #e5e7eb"
//             }}>
//                 <input type="file" ref={fileInputRef} onChange={pickImage} hidden />
//                 <button onClick={() => fileInputRef.current.click()}
//                     style={{ color: "#10B981", marginRight: 10 }}>
//                     <FaCamera size={22} />
//                 </button>

//                 <input
//                     value={input}
//                     onChange={(e) => handleTyping(e.target.value)}
//                     placeholder="Type message..."
//                     style={{
//                         flex: 1,
//                         background: isDark ? "#374151" : "#f1f5f9",
//                         borderRadius: 20,
//                         padding: "10px 14px",
//                         color: isDark ? "#fff" : "#111",
//                         border: "none",
//                         outline: "none",
//                     }}
//                 />

//                 <button
//                     onClick={handleSend}
//                     style={{
//                         marginLeft: 10,
//                         padding: "8px 16px",
//                         background: "#10B981",
//                         borderRadius: 20,
//                         color: "#fff",
//                     }}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }












"use client";

import api from '../../src/api'
import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUserCircle, FaCamera, FaPhone, FaVideo, FaEnvelope } from "react-icons/fa";
import { ChatContext } from '@/app/src/context/chatcontext';
import { animate } from "motion";

export default function ChatRoom({ userId }) {
    const { id } = useParams();
    const {
        messages,
        myUsername,
        sendMessage,
        onlineUsers,
        socket,
        typingUser,
        theme,
    } = useContext(ChatContext);

    const isDark = theme === "dark";
    const [input, setInput] = useState("");
    const [previewImg, setPreviewImg] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef();
    const messagesEndRef = useRef();
    const router = useRouter();

    useEffect(() => {
        socket.emit("setUsername", myUsername);
    }, []);

    const filtered = messages.filter(
        (m) =>
            (m.from === myUsername && m.to === id) ||
            (m.from === id && m.to === myUsername)
    );

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

    const handleVideoCall = () => {
        socket.emit("call-user", {
            from: myUsername, to: id, callType: "video", roomId: "123456"
        });
        router.push(`/chatlist/${id}/callui`);
    };

    const handleAudioCall = () => {
        socket.emit("call-user", {
            from: myUsername, to: id, callType: "audio ", roomId: "123456"
        });
        router.push(`/chatlist/auidocall/${id}`);
    };

    const handleOTP = () => {
        console.log("Send OTP to:", id);
    };

    // ✅ Typing indicator with Motion bubbles
    const TypingIndicator = ({ isMine = false, isDark = false }) => {
        const bubbleRefs = [useRef(null), useRef(null), useRef(null)];

        useEffect(() => {
            bubbleRefs.forEach((ref, index) => {
                if (!ref.current) return;
                animate(
                    ref.current,
                    { y: ["0%", "-50%", "0%"] },
                    { duration: 0.6, repeat: Infinity, delay: index * 0.2, easing: "ease-in-out" }
                );
            });
        }, []);

        const bubbleStyle = {
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: isMine ? "#fff" : isDark ? "#fff" : "#555",
            margin: "0 2px",
        };

        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20 }}>
                {bubbleRefs.map((ref, i) => (
                    <div key={i} ref={ref} style={bubbleStyle}></div>
                ))}
            </div>
        );
    };

    return (
        <div style={{
            height: "100vh",
            background: isDark ? "#111827" : "#f1f5f9",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* HEADER */}
            <div style={{
                padding: 14,
                background: isDark ? "#1F2937" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: isDark ? "none" : "1px solid #e5e7eb"
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => window.history.back()}
                        style={{ color: isDark ? "#fff" : "#111", marginRight: 10 }}>
                        ⬅
                    </button>

                    <FaUserCircle size={42} color={isDark ? "#9CA3AF" : "#64748b"} />

                    <div style={{ marginLeft: 10 }}>
                        <p style={{
                            color: isDark ? "#fff" : "#0f172a",
                            fontWeight: 600,
                            fontSize: 16
                        }}>
                            {id}
                        </p>
                        <span style={{
                            color: onlineUsers.includes(id) ? "#4ade80" : (isDark ? "#9CA3AF" : "#64748b"),
                            fontSize: 13
                        }}>
                            {onlineUsers.includes(id) ? "● Online" : "○ Offline"}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <FaVideo size={20} color="#10B981" onClick={handleVideoCall} />
                    <FaPhone size={20} color="#10B981" onClick={handleAudioCall} />
                    <FaEnvelope size={20} color="#10B981" onClick={handleOTP} />
                </div>
            </div>

            {/* MESSAGES */}
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {displayMessages.map((msg, i) => {
                    const isMine = msg.from === myUsername;
                    const isTyping = msg.id === "typing";

                    return (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: isMine ? "flex-end" : "flex-start",
                            marginBottom: 6,
                        }}>
                            <div style={{
                                maxWidth: "75%",
                                background: isMine
                                    ? "#10B981"
                                    : (isDark ? "#2D2D2D" : "#e5e7eb"),
                                padding: 10,
                                borderRadius: 14,
                                color: isMine ? "#fff" : (isDark ? "#fff" : "#111"),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                {isTyping ? <TypingIndicator isMine={isMine} isDark={isDark} />
                                    : msg.type === "image" ? (
                                        <img src={msg.message}
                                            style={{ maxWidth: 220, borderRadius: 12 }}
                                            onClick={() => setPreviewImg(msg.message)} />
                                    ) : (
                                        <p>{msg.message}</p>
                                    )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div style={{
                display: "flex",
                padding: 10,
                background: isDark ? "#1F2937" : "#ffffff",
                borderTop: isDark ? "none" : "1px solid #e5e7eb"
            }}>
                <input type="file" ref={fileInputRef} onChange={pickImage} hidden />
                <button onClick={() => fileInputRef.current.click()}
                    style={{ color: "#10B981", marginRight: 10 }}>
                    <FaCamera size={22} />
                </button>

                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type message..."
                    style={{
                        flex: 1,
                        background: isDark ? "#374151" : "#f1f5f9",
                        borderRadius: 20,
                        padding: "10px 14px",
                        color: isDark ? "#fff" : "#111",
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
                    }}>
                    Send
                </button>
            </div>
        </div>
    );
}

