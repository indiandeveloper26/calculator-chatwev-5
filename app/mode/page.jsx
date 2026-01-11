"use client"

import { useContext } from "react";
import { ChatContext } from "../src/context/chatcontext";


export default function page() {
    const { theme, toggleTheme } = useContext(ChatContext);

    console.log(theme)

    return (
        <button onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
    );
}
