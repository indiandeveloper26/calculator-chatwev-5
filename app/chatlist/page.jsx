






"use client";

import React, { useEffect, useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChatContext } from "../src/context/chatcontext";



export default function ChatList() {

    const pathname = usePathname();
    console.log('pathname', pathname)
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { visibleChats = [], onlineUsers = [], addToDeletedUsers } = useContext(ChatContext);

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
        <div className="container">
            <div className="chat-list">
                {visibleChats.length === 0 && (
                    <p className="empty-text">No chats yet. Start chatting!</p>
                )}

                {visibleChats.map((item) => {
                    const user = item.adduser || "Unknown";
                    const firstLetter = user.charAt(0).toUpperCase();
                    const isOnline = onlineUsers.includes(user);

                    return (
                        <div key={user} className="chat-item">
                            <div className="chat-left" onClick={() => openChat(item)}>
                                <div className="avatar">
                                    <span className="avatar-text">{firstLetter}</span>
                                    <span
                                        className={`online-dot ${isOnline ? "online" : "offline"}`}
                                    />
                                </div>
                                <div className="chat-text">
                                    <p className="username">{user}</p>
                                    <p className="last-message">{item.lastMessage || "Say hi!"}</p>
                                </div>
                                {item.unreadCount > 0 && (
                                    <div className="unread-badge">{item.unreadCount}</div>
                                )}
                            </div>

                            <button className="options-button" onClick={() => confirmDelete(user)}>
                                ⋮
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Sticky New Chat Button */}
            <button className="sticky-button" onClick={() => router.push("/payment")}>
                💬
            </button>

            {/* Delete Modal */}
            {modalVisible && (
                <div className="modal-overlay" onClick={() => setModalVisible(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Chat</h3>
                        <p>Are you sure you want to delete chat with {selectedUser}?</p>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setModalVisible(false)}>
                                Cancel
                            </button>
                            <button className="delete-button" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <AnimatedAdsScreen /> */}
            <style jsx>{`
        .container {
          padding: 12px;
          background-color: #121212;
          min-height: 100vh;
          
          position: relative;
          width:  100vw;
        }
        .chat-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: 100px;
        }
        .chat-item {
          display: flex;
          align-items: center;
          background-color: #1f1f1f;
          padding: 12px;
          border-radius: 12px;
          position: relative;
        }
        .chat-left {
          display: flex;
          align-items: center;
          flex: 1;
          cursor: pointer;
        }
        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 26px;
          background-color: #374151;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 12px;
          position: relative;
        }
        .avatar-text {
          color: white;
          font-weight: bold;
          font-size: 20px;
        }
        .online-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #121212;
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .online-dot.online {
          background-color: #34d399;
        }
        .online-dot.offline {
          background-color: #6b7280;
        }
        .chat-text {
          flex: 1;
          min-width: 0;
        }
        .username {
          color: white;
          font-weight: 600;
        }
        .last-message {
          color: #a1a1aa;
          font-size: 13px;
          margin-top: 2px;
        }
        .unread-badge {
          background-color: #10b981;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 3px 6px;
          border-radius: 12px;
          margin-left: 6px;
        }
        .options-button {
          background-color: #1f1f1f;
          border: none;
          color: white;
          padding: 6px;
          border-radius: 20px;
          cursor: pointer;
          margin-left: 8px;
        }
        .sticky-button {
          position: fixed;
          bottom: 25px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #25d366;
          color: white;
          font-size: 28px;
          border: none;
          cursor: pointer;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
        }
        .modal-content {
          background-color: #1f1f1f;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          gap: 10px;
        }
        .cancel-button {
          background-color: #6b7280;
          color: white;
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .delete-button {
          background-color: #ef4444;
          color: white;
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .empty-text {
          color: #a1a1aa;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
        </div>
    );
}
