// "use client";
// import { useState, useEffect, useContext } from "react";
// import { ChatContext } from "../context/chatcontext";


// export default function ClientLayout({ children }) {
//     const { socket, myUsername } = useContext(ChatContext); // ✅ access socket & username
//     const [notif, setNotif] = useState({ show: false, name: "", message: "", userIcon: "" });
//     const [animate, setAnimate] = useState(false);

//     useEffect(() => {
//         if (!socket || !myUsername) return;

//         // ✅ Listen for new private messages
//         const handleNewMessage = (msg) => {
//             if (msg.from === myUsername) return; // Don't notify for your own messages

//             // You can fetch sender’s profile photo if available (for now using placeholder)
//             const userIcon = `https://i.pravatar.cc/150?u=${msg.from}`;

//             setNotif({
//                 show: true,
//                 name: msg.from,
//                 message: msg.type === "image" ? "📷 Sent you a photo" : msg.message,
//                 userIcon,
//             });

//             setAnimate(true);

//             // Hide notification after 3s
//             const hideTimeout = setTimeout(() => {
//                 setAnimate(false);
//                 setTimeout(() => setNotif((prev) => ({ ...prev, show: false })), 500);
//             }, 3000);

//             return () => clearTimeout(hideTimeout);
//         };

//         // ✅ Listen for messages
//         socket.on("privateMessage", handleNewMessage);

//         // ✅ Cleanup
//         return () => {
//             socket.off("privateMessage", handleNewMessage);
//         };
//     }, [socket, myUsername]);

//     return (
//         <>
//             {/* 🔔 Notification Box */}
//             {notif.show && (
//                 <div
//                     className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
//                     ${animate ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-10"}`}
//                 >
//                     <div className="flex items-center gap-4 bg-white shadow-lg rounded-xl p-4 w-80 border-l-4 border-blue-500">
//                         <img
//                             src={notif.userIcon}
//                             alt={notif.name}
//                             className="w-12 h-12 rounded-full object-cover"
//                         />
//                         <div className="flex flex-col">
//                             <span className="font-semibold text-gray-800">{notif.name}</span>
//                             <span className="text-gray-600 text-sm">{notif.message}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* 🔹 Actual Page Children */}
//             {children}
//         </>
//     );
// }














"use client";

import { useState, useEffect, useContext } from "react";
import { ChatContext } from "./context/chatcontext";


export default function ClientLayout({ children }) {
    const { socket, myUsername } = useContext(ChatContext);
    const [notif, setNotif] = useState({ show: false, name: "", message: "" });
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (!socket || !myUsername) return;

        const handleNewMessage = (msg) => {
            if (msg.from === myUsername) return; // Skip own messages

            setNotif({
                show: true,
                name: msg.from,
                message: msg.type === "image" ? "📷 Sent you a photo" : msg.message,
            });

            setAnimate(true);

            const hideTimeout = setTimeout(() => {
                setAnimate(false);
                setTimeout(() => setNotif((prev) => ({ ...prev, show: false })), 500);
            }, 3000);

            return () => clearTimeout(hideTimeout);
        };

        socket.on("privateMessage", handleNewMessage);

        return () => socket.off("privateMessage", handleNewMessage);
    }, [socket, myUsername]);

    return (
        <>
            {/* 🔔 Notification Box */}
            {notif.show && (
                <div
                    className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
                    ${animate ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-10"}`}
                >
                    <div className="flex items-center gap-4 bg-white shadow-lg rounded-xl p-4 w-80 border-l-4 border-blue-500">
                        {/* First letter of sender */}
                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                            {notif.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{notif.name}</span>
                            <span className="text-gray-600 text-sm">{notif.message}</span>
                        </div>
                    </div>
                </div>
            )}

            {children}
        </>
    );
}
