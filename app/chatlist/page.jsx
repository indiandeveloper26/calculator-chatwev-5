"use client";

import React, { useEffect, useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatContext } from "../src/context/chatcontext";

// Simple function to generate color from string (username)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#34d399", // green
    "#60a5fa", // blue
    "#fbbf24", // yellow
    "#f87171", // red
    "#a78bfa", // purple
    "#f472b6", // pink
    "#f97316", // orange
    "#2dd4bf", // teal
    "#e879f9", // magenta
    "#22c55e", // lime
  ];
  return colors[Math.abs(hash) % colors.length];
}

export default function ChatList() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { visibleChats = [], onlineUsers = [], addToDeletedUsers } =
    useContext(ChatContext);

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) setUsername(savedName);
  }, []);

  const openChat = (item) => {
    if (!item?.adduser) return;
    router.push(`/chatlist/${item.adduser}`);
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDelete = () => {
    addToDeletedUsers?.(selectedUser);
    setModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 flex flex-col">
      <h1 className="text-2xl md:text-3xl text-white font-bold mb-4 md:mb-6">
        Welcome, {username || "Guest"}
      </h1>

      <div className="flex-1 overflow-y-auto space-y-3">
        {visibleChats.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            No chats yet. Start chatting!
          </p>
        )}

        {visibleChats.map((item) => {
          const user = item.adduser || "Unknown";
          const firstLetter = user.charAt(0).toUpperCase();
          const isOnline = onlineUsers.includes(user);
          const avatarBg = stringToColor(user); // Generate avatar color

          return (
            <div
              key={user}
              className="flex items-center justify-between bg-gray-800 rounded-xl p-3 md:p-4 cursor-pointer hover:bg-gray-700 transition"
            >
              <div className="flex items-center flex-1" onClick={() => openChat(item)}>
                <div
                  className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: avatarBg }}
                >
                  <span className="text-white font-bold text-lg md:text-xl">{firstLetter}</span>
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-gray-900 ${isOnline ? "bg-green-400" : "bg-gray-500"
                      }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user}</p>
                  <p className="text-gray-400 text-sm truncate">
                    {item.lastMessage || "Say hi!"}
                  </p>
                </div>

                {item.unreadCount > 0 && (
                  <div className="ml-2 bg-green-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full">
                    {item.unreadCount}
                  </div>
                )}
              </div>

              <button
                className="ml-3 text-gray-300 hover:text-red-500 transition text-xl"
                onClick={() => confirmDelete(user)}
              >
                ⋮
              </button>
            </div>
          );
        })}
      </div>

      {/* Sticky New Chat Button */}
      <button
        onClick={() => router.push("/payment")}
        className="fixed bottom-6 right-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500 text-white text-3xl md:text-4xl flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        💬
      </button>

      {/* Delete Modal */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-2xl w-11/12 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-2">Delete Chat</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete chat with{" "}
              <span className="font-semibold">{selectedUser}</span>?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
