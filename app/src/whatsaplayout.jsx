



// "use client";

// import React, { useState, useRef, useContext, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { FiSearch, FiMoreVertical, FiArrowLeft } from "react-icons/fi";
// import { ChatContext } from "./context/chatcontext";
// import api from "./api";


// export default function WhatsAppLayout() {
//     const pathname = usePathname();
//     const hideLayout = pathname.startsWith("/chatlist/");

//     const [menuOpen, setMenuOpen] = useState(false);
//     const [searchOpen, setSearchOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const inputRef = useRef(null);
//     const debounceTimeout = useRef(null);

//     const { myUsername } = useContext(ChatContext);
//     const router = useRouter();

//     // Cleanup debounce timer
//     useEffect(() => {
//         return () => {
//             if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//         };
//     }, []);

//     const logout = () => {
//         localStorage.clear();
//         router.push("/login");
//     };

//     const searchUsers = async (query) => {
//         if (!query.trim()) {
//             setUsers([]);
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         try {
//             const response = await api.post("/search", { username: query });
//             const data = response?.data;
//             if (data?.error) setUsers([]);
//             else if (Array.isArray(data)) setUsers(data);
//             else if (typeof data === "object") setUsers([data]);
//             else setUsers([]);
//         } catch (e) {
//             console.error("Search error:", e);
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearchInput = (text) => {
//         setSearchQuery(text);
//         if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
//         debounceTimeout.current = setTimeout(() => searchUsers(text), 400);
//     };

//     const handleUserClick = (userId) => {
//         router.push(`/chatlist/${userId}`);
//         closeSearchModal();
//     };

//     const closeSearchModal = () => {
//         setSearchOpen(false);
//         setSearchQuery("");
//         setUsers([]);
//     };

//     if (hideLayout) return null; // Hide layout on chatroom routes

//     return (
//         <div className="flex justify-between items-center p-4 bg-green-700 text-white sticky top-0 z-50 shadow-md">
//             {/* Logo / Title */}
//             <h1 className="text-xl font-bold">ChatApp with {myUsername}</h1>

//             {/* Action buttons */}
//             <div className="flex items-center gap-3">
//                 {/* Search Button */}
//                 <button
//                     onClick={() => setSearchOpen(true)}
//                     className="p-2 rounded-full hover:bg-green-600 transition"
//                 >
//                     <FiSearch size={22} />
//                 </button>

//                 {/* Menu Button */}
//                 <button
//                     onClick={() => setMenuOpen(!menuOpen)}
//                     className="p-2 rounded-full hover:bg-green-600 transition"
//                 >
//                     <FiMoreVertical size={22} />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {menuOpen && (
//                     <div className="absolute top-14 right-4 bg-white text-black rounded shadow-lg w-52 z-50 animate-scale-up origin-top-right">
//                         {["New group", "New broadcast", "Linked devices", "Settings"].map(
//                             (item, idx) => (
//                                 <button
//                                     key={idx}
//                                     className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
//                                     onClick={() => setMenuOpen(false)}
//                                 >
//                                     {item}
//                                 </button>
//                             )
//                         )}
//                         <button
//                             className="w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-gray-100 transition"
//                             onClick={logout}
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Search Modal */}
//             {searchOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
//                     <div className="flex items-center p-4 bg-green-700">
//                         <button onClick={closeSearchModal} className="mr-4 text-white">
//                             <FiArrowLeft size={24} />
//                         </button>
//                         <div className="flex items-center bg-white rounded-full p-2 flex-1">
//                             <FiSearch className="text-gray-400 mr-2" />
//                             <input
//                                 ref={inputRef}
//                                 value={searchQuery}
//                                 onChange={(e) => handleSearchInput(e.target.value)}
//                                 placeholder="Search users..."
//                                 className="flex-1 outline-none"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex-1 overflow-y-auto bg-white">
//                         {loading ? (
//                             <div className="text-center mt-5 text-gray-500">Loading...</div>
//                         ) : users.length > 0 ? (
//                             users.map((user, index) => (
//                                 <div
//                                     key={user._id || index}
//                                     className="flex items-center p-4 border-b cursor-pointer hover:bg-green-100 transition"
//                                     onClick={() => handleUserClick(user._id || user.username)}
//                                 >
//                                     <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold mr-4">
//                                         {user.username?.charAt(0).toUpperCase()}
//                                     </div>
//                                     <div>
//                                         <div className="font-semibold">{user.username || user.name}</div>
//                                         <div className="text-sm text-gray-500">Tap to start chat</div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : searchQuery.trim().length > 0 ? (
//                             <div className="text-center mt-5 text-gray-500">No users found 😕</div>
//                         ) : (
//                             <div className="text-center mt-5 text-gray-500">Type to search users 🔍</div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }






"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiMoreVertical, FiArrowLeft } from "react-icons/fi";
import { ChatContext } from "./context/chatcontext";
import api from "./api";

// Function to generate consistent avatar color per username
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        "#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa",
        "#f472b6", "#f97316", "#2dd4bf", "#e879f9", "#22c55e"
    ];
    return colors[Math.abs(hash) % colors.length];
}

export default function WhatsAppLayout() {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/chatlist/");

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);
    const debounceTimeout = useRef(null);

    const { myUsername } = useContext(ChatContext);
    const router = useRouter();

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    const logout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setUsers([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/search", { username: query });
            const data = response?.data;
            if (data?.error) setUsers([]);
            else if (Array.isArray(data)) setUsers(data);
            else if (typeof data === "object") setUsers([data]);
            else setUsers([]);
        } catch (e) {
            console.error("Search error:", e);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Updated: auto-hide search bar when input cleared
    const handleSearchInput = (text) => {
        setSearchQuery(text);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        // Auto-hide if input empty
        if (text.trim() === "") {
            setUsers([]);
            setSearchOpen(false);
            return;
        }

        debounceTimeout.current = setTimeout(() => searchUsers(text), 400);
    };

    const handleUserClick = (userId) => {
        router.push(`/chatlist/${userId}`);
        closeSearchModal();
    };

    const closeSearchModal = () => {
        setSearchOpen(false);
        setSearchQuery("");
        setUsers([]);
    };

    if (hideLayout) return null;

    return (
        <div className="sticky top-0 z-50 bg-gray-900 p-4 md:p-8 flex flex-col text-white shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center w-full relative">
                <h1 className="text-lg md:text-xl font-bold truncate">
                    ChatApp <span className="text-green-400">| {myUsername || "Guest"}</span>
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-800 transition"
                    >
                        <FiSearch size={22} />
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-full hover:bg-gray-800 transition"
                    >
                        <FiMoreVertical size={22} />
                    </button>

                    {menuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-52 bg-white text-black rounded-lg shadow-lg overflow-hidden animate-scale-up origin-top-right z-50">
                            {["New group", "New broadcast", "Linked devices", "Settings"].map((item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                className="w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-gray-100 transition"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            {searchOpen && (
                <div className="mt-4 w-full flex flex-col bg-gray-900">
                    <div className="flex items-center bg-gray-800 rounded-full px-3 py-2">
                        <FiSearch className="text-gray-400 mr-2" />
                        <input
                            ref={inputRef}
                            value={searchQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            placeholder="Search users..."
                            className="flex-1 outline-none bg-gray-800 text-white placeholder-gray-400"
                        />
                        <button onClick={closeSearchModal} className="ml-2 text-gray-400 hover:text-white">
                            <FiArrowLeft size={22} />
                        </button>
                    </div>

                    {/* Users List */}
                    <div className="mt-2 max-h-64 overflow-y-auto bg-gray-800 rounded-xl">
                        {loading ? (
                            <p className="text-center text-gray-400 py-4">Loading...</p>
                        ) : users.length > 0 ? (
                            users.map((user, idx) => {
                                const username = user.username || user.name || "Unknown";
                                const firstLetter = username.charAt(0).toUpperCase();
                                const avatarBg = stringToColor(username);

                                return (
                                    <div
                                        key={user._id || idx}
                                        className="flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                                        onClick={() => handleUserClick(user._id || username)}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                                            style={{ backgroundColor: avatarBg }}
                                        >
                                            {firstLetter}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{username}</div>
                                            <div className="text-sm text-gray-400">Tap to start chat</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : searchQuery.trim() ? (
                            <p className="text-center text-gray-400 py-4">No users found 😕</p>
                        ) : (
                            <p className="text-center text-gray-400 py-4">Type to search users 🔍</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
