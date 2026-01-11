
// "use client";

// import React, { createContext, useState, useEffect, useCallback, useRef } from "react";

// import api from "../api";
// import { useRouter } from "next/navigation";
// import socket from "../sockt";
// import { ClientSegmentRoot } from "next/dist/client/components/client-segment";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//     const [myUsername, setMyUsername] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [chatList, setChatList] = useState([]);
//     const [typingUser, setTypingUser] = useState(null);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const [deletedUsers, setDeletedUsers] = useState([]);
//     const [layouthide, setlayouthide] = useState(true)
//     const [isPremium, setIsPremium] = useState(false);
//     const [premiumExpiry, setPremiumExpiry] = useState(null);
//     const [login, setLogin] = useState(false);
//     const [activeChatRoom, setActiveChatRoom] = useState(false);
//     const [incomingCall, setIncomingCall] = useState(false);
//     const [incomingUser, setIncomingUser] = useState("");
//     const [acceptedCall, setAcceptedCall] = useState(false);
//     const [groupMessages, setGroupMessages] = useState({});
//     const [callchek, setcallchek] = useState(true)
//     const [userdata, setUserdata] = useState(null);
//     const [setcurrenuser, setsetcurrenuser] = useState(null)
//     const typingTimeoutRef = useRef(null);
//     const [theme, setTheme] = useState("light");
//     const [themeMounted, setThemeMounted] = useState(false);


//     let ruter = useRouter()

//     // ✅ UUID generator
//     const uuidv4 = () =>
//         "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//             const r = Math.random() * 16 | 0;
//             const v = c === "x" ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });


//     useEffect(() => {
//         if (typeof window === "undefined") return;

//         const savedTheme = localStorage.getItem("theme");

//         if (savedTheme) {
//             setTheme(savedTheme);
//         } else {
//             const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
//                 ? "dark"
//                 : "light";
//             setTheme(systemTheme);
//         }

//         setThemeMounted(true);
//     }, []);


//     useEffect(() => {
//         if (!themeMounted) return;

//         document.documentElement.classList.remove("light", "dark");
//         document.documentElement.classList.add(theme);
//         localStorage.setItem("theme", theme);
//     }, [theme, themeMounted]);


//     const toggleTheme = () => {
//         setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//     };


//     // ✅ Initialize user and socket
//     useEffect(() => {

//         console.log('socket conet hua name se')
//         if (!socket.connected) socket.connect();

//         const name = localStorage.getItem("username");
//         if (myUsername) {
//             setMyUsername(myUsername);
//             setLogin(true);
//             socket.emit("setUsername", name);

//             try {
//                 const savedList = JSON.parse(localStorage.getItem(`chatlist_${name}`)) || [];
//                 const savedMsgs = JSON.parse(localStorage.getItem(`messages_${name}`)) || [];
//                 const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${name}`)) || [];
//                 setChatList(savedList);
//                 setMessages(savedMsgs);
//                 setDeletedUsers(savedDeleted);
//             } catch (err) {
//                 console.error("LocalStorage parsing error:", err);
//             }
//         }
//     }, [myUsername]);



//     useEffect(() => {

//         socket.on("webrtc-offer", async ({ from, sdp }) => {
//             console.log("📨 Offer received from", from);

//             await pc.current.setRemoteDescription({
//                 type: "offer",
//                 sdp,
//             });
//             ClientSegmentRoot()
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);

//             socket.emit("webrtc-answer", {
//                 to: from,
//                 sdp: answer.sdp,
//             });
//         });

//     }, [socket])


//     // ✅ Fetch userdata from API
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const username = localStorage.getItem("username");
//             if (!username) return;

//             try {
//                 const res = await api.post("/userdata", { myUsername: username });
//                 const user = res.data.dta;
//                 setUserdata(user);
//                 setMyUsername(username);
//                 localStorage.setItem("userdata", JSON.stringify(user));

//                 if (user.isPremium || user.premium) {
//                     setIsPremium(true);
//                     localStorage.setItem("isPremium", "true");
//                     if (user.premiumExpiry) {
//                         setPremiumExpiry(user.premiumExpiry);
//                         localStorage.setItem("premiumExpiry", user.premiumExpiry);
//                     }
//                 } else {
//                     setIsPremium(false);
//                     setPremiumExpiry(null);
//                     localStorage.setItem("isPremium", "false");
//                     localStorage.removeItem("premiumExpiry");
//                 }
//             } catch (err) {
//                 console.error("Error fetching user:",);
//             }
//         };
//         fetchUserData();
//     }, []);

//     // ✅ Typing indicator
//     useEffect(() => {
//         const handleTyping = ({ from }) => {
//             setTypingUser(from);
//             if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//             typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
//         };
//         socket.on("typing", handleTyping);
//         return () => socket.off("typing", handleTyping);
//     }, []);

//     // ✅ Online/offline status
//     useEffect(() => {
//         const handleStatus = ({ username, online }) => {

//             console.log('useronline', username)
//             setOnlineUsers((prev) => {
//                 const filtered = prev.filter((u) => u !== username);
//                 return online ? [...filtered, username] : filtered;
//             });
//         };
//         socket.on("userStatus", handleStatus);
//         return () => socket.off("userStatus", handleStatus);
//     }, []);

//     // ✅ Incoming call listeners
//     useEffect(() => {
//         const handleIncomingCall = ({ from, type, to, roomId }) => {
//             // console.log("📞 Incoming call from:", JSON.stringify(type));
//             setIncomingUser({ from, type, to, roomId });
//             setIncomingCall(true);
//             console.log('incoming call ka', from, roomId)

//             console.log('incomit ', incomingCall)
//         };

//         // const handleCallAccepted = ({ from }) => {
//         //     console.log("✅ Call accepted by:", from);
//         //     setAcceptedCall(true);
//         //     setIncomingCall(false);

//         //     socket.emit('accept-call', { to: myUsername })



//         //     ruter.push(`/chatlist/${from}/callui/videocall`);
//         // };


//         const handleCallAccepted = ({ from }) => {


//             console.log('call utha liye usme ab')
//             console.log("✅ Call accepted by:", from);
//             setAcceptedCall(true);
//             setIncomingCall(false);

//             ruter.push(`chatlist`);

//             // socket.emit('accept-call', { to: myUsername });

//             // console.log(incomingUser)

//             // // Use incomingUser.type to decide route
//             // if (incomingUser?.type === 'audio') {
//             //     console.log('type auso')
//             //     ruter.push("/");
//             // } else if (incomingUser?.type === 'video') {
//             //     console.log('type vidoecall')
//             //     ruter.push(`/`);
//             // } else {
//             //     // fallback
//             //     ruter.push(`/chatlist/${from}`);
//             // }
//         };


//         const handleCallRejected = ({ by }) => {

//             setcallchek(false)

//             console.log('call reject ho gya yrr', by)
//             console.log("❌ Call rejected kiya gya:", JSON.stringify(by));
//             setIncomingCall(false);
//             setAcceptedCall(false);

//             // alert('ja chia fir se ')
//             ruter.push(`/chatlist/${by}`);
//             // ruter.push('login')

//         };



//         socket.on("incoming-call", handleIncomingCall);
//         socket.on("call-accepted", handleCallAccepted);
//         socket.on('end-call', handleCallRejected);

//         return () => {
//             socket.off("incoming-call", handleIncomingCall);
//             socket.off("call-accepted", handleCallAccepted);
//             socket.off("end-call", handleCallRejected);
//         };
//     }, [acceptedCall, incomingCall]);

//     // ✅ Emit when user clicks video call
//     const callUser = (to) => {
//         if (!to || !myUsername) return;
//         console.log("📤 Calling user:", to);
//         socket.emit("call-user", { from: myUsername, to });
//     };

//     // ✅ Accept call
//     const acceptCall = (from) => {
//         if (!from || !myUsername) return;
//         console.log("✅ Accepting call from:", from);
//         socket.emit("accept-call", { from, to: myUsername });
//         setIncomingCall(false);
//         setAcceptedCall(true);
//     };

//     // ✅ Reject call
//     const rejectCall = (from) => {
//         if (!from || !myUsername) return;
//         console.log("❌ Rejecting call from:", from);
//         socket.emit("reject-call", { from, to: myUsername });
//         setIncomingCall(false);
//         setAcceptedCall(false);
//     };

//     // ✅ Handle incoming private messages
//     const handleIncomingMessage = useCallback((msg) => {

//         // console.log('messs', msg)
//         if (!msg.id) return;
//         const { from, to, message, type } = msg;
//         const otherUser = from === myUsername ? to : from;

//         setDeletedUsers((prev) => {
//             if (prev.includes(otherUser)) {
//                 const updated = prev.filter((u) => u !== otherUser);
//                 localStorage.setItem(`deleted_${myUsername}`, JSON.stringify(updated));
//                 return updated;
//             }
//             return prev;
//         });

//         setMessages((prev) => {
//             if (prev.some((m) => m.id === msg.id)) return prev;
//             const updated = [...prev, msg];
//             localStorage.setItem(`messages_${myUsername}`, JSON.stringify(updated));
//             return updated;
//         });

//         setChatList((prev) => {
//             const index = prev.findIndex((c) => c.adduser === otherUser);
//             let updated;
//             if (index !== -1) {
//                 updated = [...prev];
//                 updated[index] = {
//                     ...updated[index],
//                     lastMessage: type === "image" ? "📷 Photo" : message,
//                     unreadCount: from === myUsername ? 0 : (updated[index].unreadCount || 0) + 1,
//                 };
//                 const [moved] = updated.splice(index, 1);
//                 updated.unshift(moved);
//             } else {
//                 updated = [
//                     { adduser: otherUser, lastMessage: type === "image" ? "📷 Photo" : message, unreadCount: from === myUsername ? 0 : 1 },
//                     ...prev,
//                 ];
//             }
//             localStorage.setItem(`chatlist_${myUsername}`, JSON.stringify(updated));
//             return updated;
//         });
//     }, [myUsername]);

//     useEffect(() => {
//         if (!myUsername) return;
//         socket.on("privateMessage", handleIncomingMessage);
//         return () => socket.off("privateMessage", handleIncomingMessage);
//     }, [myUsername, handleIncomingMessage]);

//     // ✅ Send private message
//     const sendMessage = (to, message, type = "text") => {
//         const payload = {
//             id: uuidv4(),
//             from: myUsername,
//             to,
//             message,
//             type,
//             timestamp: new Date().toISOString(),
//             seen: false,
//         };
//         socket.emit("sendMessage", payload);
//         handleIncomingMessage(payload);
//     };

//     // ✅ Group messages
//     const sendGroupMessage = (groupId, username, text, type = "text") => {
//         const payload = { groupId, username, message: text, type, timestamp: new Date().toISOString() };
//         socket.emit("groupMessage", payload);
//         setGroupMessages((prev) => {
//             const prevMsgs = prev[groupId] || [];
//             return { ...prev, [groupId]: [...prevMsgs, payload] };
//         });
//     };

//     const joinGroup = (groupId) => socket.emit("joinGroup", { groupId, username: myUsername });
//     const leaveGroup = (groupId) => {
//         socket.emit("leaveGroup", { groupId, username: myUsername });
//         setGroupMessages((prev) => ({ ...prev, [groupId]: [] }));
//     };

//     const markChatAsRead = (otherUser) => {
//         setChatList((prev) => {
//             const updated = prev.map((item) => (item.adduser === otherUser ? { ...item, unreadCount: 0 } : item));
//             localStorage.setItem(`chatlist_${myUsername}`, JSON.stringify(updated));
//             return updated;
//         });
//     };

//     const addToDeletedUsers = (user) => {
//         setDeletedUsers((prev) => {
//             const updated = prev.includes(user) ? prev : [...prev, user];
//             localStorage.setItem(`deleted_${myUsername}`, JSON.stringify(updated));
//             return updated;
//         });
//     };

//     const clearAll = () => {
//         setMyUsername("");
//         setMessages([]);
//         setChatList([]);
//         setTypingUser(null);
//         setOnlineUsers([]);
//         setDeletedUsers([]);
//         setIsPremium(false);
//         localStorage.clear();
//     };

//     const updatePremium = (status, expiryDate) => {
//         setIsPremium(status);
//         localStorage.setItem("isPremium", status ? "true" : "false");
//         if (status && expiryDate) {
//             setPremiumExpiry(expiryDate);
//             localStorage.setItem("premiumExpiry", expiryDate);
//         } else {
//             setPremiumExpiry(null);
//             localStorage.removeItem("premiumExpiry");
//         }
//     };

//     const visibleChats = chatList.filter((c) => !deletedUsers.includes(c.adduser));

//     return (
//         <ChatContext.Provider
//             value={{
//                 socket,
//                 myUsername,
//                 messages,
//                 visibleChats,
//                 typingUser,
//                 onlineUsers,
//                 deletedUsers,
//                 sendMessage,
//                 markChatAsRead,
//                 addToDeletedUsers,
//                 setMyUsername,
//                 setcurrenuser, setsetcurrenuser,
//                 clearAll,
//                 isPremium,
//                 updatePremium,
//                 incomingUser,
//                 incomingCall,
//                 acceptedCall,
//                 premiumExpiry,
//                 groupMessages,
//                 joinGroup,
//                 sendGroupMessage,
//                 activeChatRoom,
//                 setActiveChatRoom,
//                 login,
//                 setLogin,
//                 leaveGroup,
//                 setIncomingCall,
//                 callchek,
//                 setcallchek,
//                 // 📞 added call functions
//                 callUser,
//                 acceptCall,
//                 layouthide,
//                 setlayouthide,
//                 theme,
//                 toggleTheme,
//                 rejectCall,
//             }}
//         >
//             {children}
//         </ChatContext.Provider>
//     );
// };











"use client";

import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../api";
import socket from "../sockt";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [myUsername, setMyUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [layouthide, setlayouthide] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [premiumExpiry, setPremiumExpiry] = useState(null);
    const [login, setLogin] = useState(false);
    const [activeChatRoom, setActiveChatRoom] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [incomingUser, setIncomingUser] = useState(null);
    const [acceptedCall, setAcceptedCall] = useState(false);
    const [groupMessages, setGroupMessages] = useState({});
    const [callchek, setcallchek] = useState(true);
    const [userdata, setUserdata] = useState(null);
    const [setcurrenuser, setsetcurrenuser] = useState(null);
    const typingTimeoutRef = useRef(null);
    const [theme, setTheme] = useState("light");
    const [themeMounted, setThemeMounted] = useState(false);

    // const pc = useRef(new RTCPeerConnection()); // WebRTC peer connection
    const router = useRouter();



    // UUID generator
    const uuidv4 = () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });

    // Theme initialization
    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) setTheme(savedTheme);
        else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            setTheme(systemTheme);
        }
        setThemeMounted(true);
    }, []);

    useEffect(() => {
        if (!themeMounted) return;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme, themeMounted]);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    // Initialize user and socket
    useEffect(() => {
        if (!socket.connected) socket.connect();
        const name = localStorage.getItem("username");
        if (name) {
            setMyUsername(name);
            setLogin(true);
            socket.emit("setUsername", name);

            try {
                const savedList = JSON.parse(localStorage.getItem(`chatlist_${name}`)) || [];
                const savedMsgs = JSON.parse(localStorage.getItem(`messages_${name}`)) || [];
                const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${name}`)) || [];
                setChatList(savedList);
                setMessages(savedMsgs);
                setDeletedUsers(savedDeleted);
            } catch (err) {
                console.error("LocalStorage parsing error:", err);
            }
        }
    }, []);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const username = localStorage.getItem("username");
            if (!username) return;
            try {
                const res = await api.post("/userdata", { myUsername: username });
                const user = res.data.data;

                console.log('prmiun chek', res.data.data)
                setUserdata(user);
                localStorage.setItem("userdata", JSON.stringify(user));

                if (user.isPremium || user.premium) {
                    setIsPremium(true);
                    localStorage.setItem("isPremium", "true");
                    if (user.premiumExpiry) {
                        setPremiumExpiry(user.premiumExpiry);
                        localStorage.setItem("premiumExpiry", user.premiumExpiry);
                    }
                } else {
                    setIsPremium(false);
                    setPremiumExpiry(null);
                    localStorage.setItem("isPremium", "false");
                    localStorage.removeItem("premiumExpiry");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUserData();
    }, []);

    // Typing indicator
    useEffect(() => {
        const handleTyping = ({ from }) => {
            setTypingUser(from);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
        };
        socket.on("typing", handleTyping);
        return () => socket.off("typing", handleTyping);
    }, []);

    // Online/offline users
    useEffect(() => {
        const handleStatus = ({ username, online }) => {
            setOnlineUsers((prev) => {
                const filtered = prev.filter((u) => u !== username);
                return online ? [...filtered, username] : filtered;
            });
        };
        socket.on("userStatus", handleStatus);
        return () => socket.off("userStatus", handleStatus);
    }, []);

    // Incoming call listeners
    useEffect(() => {
        const handleIncomingCall = ({ from, callType, roomId }) => {
            setIncomingUser({ from, callType, roomId });
            setIncomingCall(true);
        };

        const handleCallAccepted = ({ from, type }) => {

            console.log('call acpeted', type, from)

            setIncomingUser({ from, type })
            setAcceptedCall(true);
            setIncomingCall(false);
            router.push(`/chatlist/${'akku'}/callui/videocall`);
        };

        const handleCallRejected = ({ by }) => {

            console.log('call cut kiya usne ')
            setcallchek(false);
            setIncomingCall(false);
            setAcceptedCall(false);
            router.push(`/chatlist/${by}`);
        };

        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);
        socket.on("end-call", handleCallRejected);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
            socket.off("end-call", handleCallRejected);
        };
    }, [acceptedCall, incomingCall]);

    // Call functions
    const callUser = (to) => {
        if (!to || !myUsername) return;
        socket.emit("call-user", { from: myUsername, to });
    };
    const acceptCall = (from) => {
        if (!from || !myUsername) return;
        socket.emit("accept-call", { from, to: myUsername });
        setIncomingCall(false);
        setAcceptedCall(true);
    };
    const rejectCall = (from) => {
        if (!from || !myUsername) return;
        socket.emit("reject-call", { from, to: myUsername });
        setIncomingCall(false);
        setAcceptedCall(false);
    };

    // Handle incoming private message
    const handleIncomingMessage = useCallback(
        (msg) => {
            if (!msg.id) return;
            const { from, to, message, type } = msg;
            const otherUser = from === myUsername ? to : from;

            setDeletedUsers((prev) => {
                if (prev.includes(otherUser)) {
                    const updated = prev.filter((u) => u !== otherUser);
                    localStorage.setItem(`deleted_${myUsername}`, JSON.stringify(updated));
                    return updated;
                }
                return prev;
            });

            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                const updated = [...prev, msg];
                localStorage.setItem(`messages_${myUsername}`, JSON.stringify(updated));
                return updated;
            });

            setChatList((prev) => {
                const index = prev.findIndex((c) => c.adduser === otherUser);
                let updated;
                if (index !== -1) {
                    updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        lastMessage: type === "image" ? "📷 Photo" : message,
                        unreadCount: from === myUsername ? 0 : (updated[index].unreadCount || 0) + 1,
                    };
                    const [moved] = updated.splice(index, 1);
                    updated.unshift(moved);
                } else {
                    updated = [
                        { adduser: otherUser, lastMessage: type === "image" ? "📷 Photo" : message, unreadCount: from === myUsername ? 0 : 1 },
                        ...prev,
                    ];
                }
                localStorage.setItem(`chatlist_${myUsername}`, JSON.stringify(updated));
                return updated;
            });
        },
        [myUsername]
    );

    useEffect(() => {
        if (!myUsername) return;
        socket.on("privateMessage", handleIncomingMessage);
        return () => socket.off("privateMessage", handleIncomingMessage);
    }, [myUsername, handleIncomingMessage]);

    const sendMessage = (to, message, type = "text") => {
        const payload = { id: uuidv4(), from: myUsername, to, message, type, timestamp: new Date().toISOString(), seen: false };
        socket.emit("sendMessage", payload);
        handleIncomingMessage(payload);
    };

    const sendGroupMessage = (groupId, username, text, type = "text") => {
        const payload = { groupId, username, message: text, type, timestamp: new Date().toISOString() };
        socket.emit("groupMessage", payload);
        setGroupMessages((prev) => ({ ...prev, [groupId]: [...(prev[groupId] || []), payload] }));
    };

    const joinGroup = (groupId) => socket.emit("joinGroup", { groupId, username: myUsername });
    const leaveGroup = (groupId) => {
        socket.emit("leaveGroup", { groupId, username: myUsername });
        setGroupMessages((prev) => ({ ...prev, [groupId]: [] }));
    };

    const markChatAsRead = (otherUser) => {
        setChatList((prev) => {
            const updated = prev.map((item) => (item.adduser === otherUser ? { ...item, unreadCount: 0 } : item));
            localStorage.setItem(`chatlist_${myUsername}`, JSON.stringify(updated));
            return updated;
        });
    };

    const addToDeletedUsers = (user) => {
        setDeletedUsers((prev) => {
            const updated = prev.includes(user) ? prev : [...prev, user];
            localStorage.setItem(`deleted_${myUsername}`, JSON.stringify(updated));
            return updated;
        });
    };

    const clearAll = () => {
        setMyUsername("");
        setMessages([]);
        setChatList([]);
        setTypingUser(null);
        setOnlineUsers([]);
        setDeletedUsers([]);
        setIsPremium(false);
        localStorage.clear();
    };

    const updatePremium = (status, expiryDate) => {
        setIsPremium(status);
        localStorage.setItem("isPremium", status ? "true" : "false");
        if (status && expiryDate) {
            setPremiumExpiry(expiryDate);
            localStorage.setItem("premiumExpiry", expiryDate);
        } else {
            setPremiumExpiry(null);
            localStorage.removeItem("premiumExpiry");
        }
    };

    const visibleChats = chatList.filter((c) => !deletedUsers.includes(c.adduser));

    return (
        <ChatContext.Provider
            value={{
                socket,
                myUsername,
                messages,
                visibleChats,
                typingUser,
                onlineUsers,
                deletedUsers,
                sendMessage,
                markChatAsRead,
                addToDeletedUsers,
                setMyUsername,
                setcurrenuser,
                setsetcurrenuser,
                clearAll,
                isPremium,
                updatePremium,
                incomingUser,
                incomingCall,
                acceptedCall,
                premiumExpiry,
                groupMessages,
                joinGroup,
                sendGroupMessage,
                activeChatRoom,
                setActiveChatRoom,
                login,
                setLogin,
                leaveGroup,
                setIncomingCall,
                callchek,
                setcallchek,
                callUser,
                acceptCall,
                layouthide,
                setlayouthide,
                theme,
                toggleTheme,
                rejectCall,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
