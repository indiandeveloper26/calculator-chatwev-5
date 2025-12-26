
"use client";
import { useState, useContext } from "react";
import Image from "next/image";
// static image in /assets
import { useRouter } from "next/navigation"

import api from "@/src/api";
import { ChatContext } from "@/src/context/chatcontext";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setMyUsername, login, setLogin, updatePremium } = useContext(ChatContext);

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            const { data } = await api.post("/log", {
                username: username.toLowerCase(),
                password,
            });

            if (data.token) localStorage.setItem("tokenn", data.token);
            if (data.user?.username) {
                localStorage.setItem("username", data.user.username);
                setMyUsername(data.user.username);
            }

            if (data.userdata) {
                if (data.userdata.premiumExpiry)
                    localStorage.setItem("premiumExpiry", data.userdata.premiumExpiry);
                if (data.userdata.isPremium !== undefined) {
                    localStorage.setItem("isPremium", data.userdata.isPremium.toString());
                    updatePremium(data.userdata.isPremium, data.userdata.premiumExpiry);
                }
            }

            alert("✅ Login Successful!");
            setLogin(true);
            router.push("/chatlist"); // redirect to chat page
        } catch (err) {
            console.log(err);
            alert("❌ Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                {/* Background Image */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 rounded-2xl overflow-hidden">
                    <Image src={'/login.jpg'} alt="Login Background" layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={'/login.jpg'} alt="Logo" width={220} height={150} className="rounded-xl" />
                </div>

                <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome 👋</h1>
                <p className="text-center text-gray-300 mb-6">Sign in to continue chatting</p>

                {/* Username */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
                        }}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-600"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
                >
                    {loading ? "Loading..." : "Login"}
                </button>

                {/* Signup Button */}
                <button
                    onClick={() => router.push("/singupp")}
                    className="w-full py-3 mt-2 bg-white text-blue-600 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}
