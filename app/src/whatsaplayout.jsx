



"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiMoreVertical, FiArrowLeft } from "react-icons/fi";
import { ChatContext } from "./context/chatcontext";
import api from "./api";


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

    // Cleanup debounce timer
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

    const handleSearchInput = (text) => {
        setSearchQuery(text);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
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

    if (hideLayout) return null; // Hide layout on chatroom routes

    return (
        <div className="flex justify-between items-center p-4 bg-green-700 text-white sticky top-0 z-50 shadow-md">
            {/* Logo / Title */}
            <h1 className="text-xl font-bold">ChatApp with {myUsername}</h1>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-green-600 transition"
                >
                    <FiSearch size={22} />
                </button>

                {/* Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full hover:bg-green-600 transition"
                >
                    <FiMoreVertical size={22} />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-14 right-4 bg-white text-black rounded shadow-lg w-52 z-50 animate-scale-up origin-top-right">
                        {["New group", "New broadcast", "Linked devices", "Settings"].map(
                            (item, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item}
                                </button>
                            )
                        )}
                        <button
                            className="w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-gray-100 transition"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
                    <div className="flex items-center p-4 bg-green-700">
                        <button onClick={closeSearchModal} className="mr-4 text-white">
                            <FiArrowLeft size={24} />
                        </button>
                        <div className="flex items-center bg-white rounded-full p-2 flex-1">
                            <FiSearch className="text-gray-400 mr-2" />
                            <input
                                ref={inputRef}
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Search users..."
                                className="flex-1 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white">
                        {loading ? (
                            <div className="text-center mt-5 text-gray-500">Loading...</div>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <div
                                    key={user._id || index}
                                    className="flex items-center p-4 border-b cursor-pointer hover:bg-green-100 transition"
                                    onClick={() => handleUserClick(user._id || user.username)}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold mr-4">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{user.username || user.name}</div>
                                        <div className="text-sm text-gray-500">Tap to start chat</div>
                                    </div>
                                </div>
                            ))
                        ) : searchQuery.trim().length > 0 ? (
                            <div className="text-center mt-5 text-gray-500">No users found 😕</div>
                        ) : (
                            <div className="text-center mt-5 text-gray-500">Type to search users 🔍</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
