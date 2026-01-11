"use client";

import React from "react";
import { toast } from "react-toastify";

export default function ClickBox() {
    const handleClick = () => {
        toast.success("Box clicked! 🎉"); // Success type
        toast.info("This is info toast! ℹ️"); // Info type
        console.log("Box clicked!");
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f1f5f9"
        }}>
            <div
                onClick={handleClick}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    background: "#10B981",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    cursor: "pointer"
                }}
            >
                Click Me
            </div>
        </div>
    );
}
