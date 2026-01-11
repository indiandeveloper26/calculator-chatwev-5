// "use client";

// import React, { useState, useContext } from "react";
// import Image from "next/image";

// import { useRouter } from "next/navigation";

// import api from "@/app/src/api";
// import { ChatContext } from "../src/context/chatcontext";


// export default function SignupPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     const { setMyUsername, updatePremium,
//         setLogin, } = useContext(ChatContext);


//     let router = useRouter()

//     // Validation
//     const validate = () => {
//         const newErrors = {};
//         if (!username.trim()) newErrors.username = "Username is required";
//         if (!password) newErrors.password = "Password is required";
//         else if (password.length < 6) newErrors.password = "Min 6 chars";
//         if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
//         else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Signup handler
//     const handleSignup = async () => {
//         if (!validate()) return;

//         setLoading(true);
//         const lowerUsername = username.toLowerCase();

//         try {
//             const { data } = await api.post("/singup", {
//                 username: lowerUsername,
//                 password,
//                 withCredentials: true
//             });
//             console.log('dta', data)

//             if (data.token) localStorage.setItem("tokenn", data.token);
//             if (data.user?.username) {
//                 localStorage.setItem("username", data.user.username);
//                 setMyUsername(data.user.username);
//             }

//             if (data.user?.premiumExpiry) {
//                 localStorage.setItem("premiumExpiry", data.user.premiumExpiry);
//             }
//             if (data.user?.isPremium !== undefined) {
//                 localStorage.setItem("isPremium", data.user.isPremium.toString());
//                 updatePremium(data.user.isPremium, data.user.premiumExpiry);
//             }

//             alert("✅ Signup successful! You got 2 days premium!");
//             router.push('chatlist')

//             setLogin(true);
//         } catch (error) {
//             console.error(error);
//             alert("❌ Signup failed, please try again!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container">
//             <div className="card">
//                 <Image src="/login.jpg" alt="Logo" width={280} height={180} className="logo" />
//                 <h1 className="title">Create Account</h1>
//                 <p className="subtitle">Sign up to start chatting</p>

//                 {/* Username */}
//                 <div className="inputWrapper">
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => {
//                             setUsername(e.target.value);
//                             if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
//                         }}
//                     />
//                 </div>
//                 {errors.username && <p className="errorText">{errors.username}</p>}

//                 {/* Password */}
//                 <div className="inputWrapper">
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => {
//                             setPassword(e.target.value);
//                             if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
//                         }}
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? "Hide" : "Show"}
//                     </button>
//                 </div>
//                 {errors.password && <p className="errorText">{errors.password}</p>}

//                 {/* Confirm Password */}
//                 <div className="inputWrapper">
//                     <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         onChange={(e) => {
//                             setConfirmPassword(e.target.value);
//                             if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
//                         }}
//                     />
//                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                         {showConfirmPassword ? "Hide" : "Show"}
//                     </button>
//                 </div>
//                 {errors.confirmPassword && <p className="errorText">{errors.confirmPassword}</p>}

//                 {/* Signup Button */}
//                 <button className="button" onClick={handleSignup} disabled={loading}>
//                     {loading ? "Loading..." : "Sign Up"}
//                 </button>

//                 {/* Login Button */}
//                 <button className="altButton" onClick={() => window.location.href = "/login"}>
//                     Login
//                 </button>
//             </div>

//             <style jsx>{`
//         .container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           padding: 20px;
//         }
//         .card {
//           max-width: 380px;
//           width: 100%;
//           border-radius: 20px;
//           padding: 24px;
//           background-color: rgba(255, 255, 255, 0.9);
//           box-shadow: 0 8px 16px rgba(0,0,0,0.25);
//           text-align: center;
//         }
//         .logo {
//           border-radius: 20px;
//           margin-bottom: 16px;
//         }
//         .title { font-size: 28px; font-weight: 800; margin: 0; }
//         .subtitle { font-size: 14px; margin-bottom: 20px; }
//         .inputWrapper {
//           display: flex;
//           align-items: center;
//           margin-bottom: 16px;
//           border-radius: 12px;
//           border: 1px solid #ccc;
//           padding: 8px;
//         }
//         input {
//           flex: 1;
//           padding: 10px;
//           border: none;
//           outline: none;
//         }
//         button {
//           cursor: pointer;
//         }
//         .button {
//           background-color: #2563EB;
//           color: white;
//           width: 100%;
//           padding: 14px;
//           border-radius: 12px;
//           margin-top: 8px;
//           border: none;
//           font-weight: 700;
//         }
//         .altButton {
//           background-color: #fff;
//           color: #0F172A;
//           margin-top: 12px;
//           width: 100%;
//           padding: 14px;
//           border-radius: 12px;
//           border: 1px solid #ccc;
//           font-weight: 700;
//         }
//         .errorText {
//           color: #EF4444;
//           font-size: 13px;
//           text-align: left;
//           margin: -12px 0 8px 0;
//         }
//       `}</style>
//         </div>
//     );
// }












"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import api from "@/app/src/api";
import { ChatContext } from "../src/context/chatcontext";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const {
        setMyUsername,
        updatePremium,
        setLogin,
        theme,
    } = useContext(ChatContext);

    const router = useRouter();

    // Validation
    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Min 6 chars";
        if (!confirmPassword)
            newErrors.confirmPassword = "Confirm password is required";
        else if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Signup handler
    const handleSignup = async () => {
        if (!validate()) return;

        setLoading(true);
        const lowerUsername = username.toLowerCase();

        try {
            const { data } = await api.post("/singup", {
                username: lowerUsername,
                password,
                withCredentials: true,
            });

            if (data.token) localStorage.setItem("tokenn", data.token);
            if (data.user?.username) {
                localStorage.setItem("username", data.user.username);
                setMyUsername(data.user.username);
            }

            if (data.user?.premiumExpiry) {
                localStorage.setItem(
                    "premiumExpiry",
                    data.user.premiumExpiry
                );
            }
            if (data.user?.isPremium !== undefined) {
                localStorage.setItem(
                    "isPremium",
                    data.user.isPremium.toString()
                );
                updatePremium(
                    data.user.isPremium,
                    data.user.premiumExpiry
                );
            }

            alert("✅ Signup successful! You got 2 days premium!");
            setLogin(true);
            router.push("/chatlist");
        } catch (error) {
            console.error(error);
            alert("❌ Signup failed, please try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`container ${theme === "dark" ? "dark" : "light"}`}
        >
            <div className="card">
                <Image
                    src="/login.jpg"
                    alt="Logo"
                    width={280}
                    height={180}
                    className="logo"
                />

                <h1 className="title">Create Account</h1>
                <p className="subtitle">Sign up to start chatting</p>

                {/* Username */}
                <div className="inputWrapper">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username)
                                setErrors((prev) => ({
                                    ...prev,
                                    username: null,
                                }));
                        }}
                    />
                </div>
                {errors.username && (
                    <p className="errorText">{errors.username}</p>
                )}

                {/* Password */}
                <div className="inputWrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password)
                                setErrors((prev) => ({
                                    ...prev,
                                    password: null,
                                }));
                        }}
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {errors.password && (
                    <p className="errorText">{errors.password}</p>
                )}

                {/* Confirm Password */}
                <div className="inputWrapper">
                    <input
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword)
                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: null,
                                }));
                        }}
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="errorText">
                        {errors.confirmPassword}
                    </p>
                )}

                {/* Signup Button */}
                <button
                    className="button"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>

                {/* Login Button */}
                <button
                    className="altButton"
                    onClick={() => router.push("/login")}
                >
                    Login
                </button>
            </div>

            <style jsx>{`
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                    transition: background 0.3s;
                }

                .container.light {
                    background: #f1f5f9;
                }

                .container.dark {
                    background: #020617;
                }

                .card {
                    max-width: 380px;
                    width: 100%;
                    border-radius: 20px;
                    padding: 24px;
                    text-align: center;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
                    background: ${theme === "dark"
                    ? "#0f172a"
                    : "rgba(255,255,255,0.95)"};
                }

                .logo {
                    border-radius: 20px;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 0;
                    color: ${theme === "dark"
                    ? "#fff"
                    : "#0f172a"};
                }

                .subtitle {
                    font-size: 14px;
                    margin-bottom: 20px;
                    color: ${theme === "dark"
                    ? "#94a3b8"
                    : "#475569"};
                }

                .inputWrapper {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    border-radius: 12px;
                    padding: 8px;
                    border: 1px solid
                        ${theme === "dark"
                    ? "#334155"
                    : "#cbd5f5"};
                    background: ${theme === "dark"
                    ? "#020617"
                    : "#fff"};
                }

                input {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    outline: none;
                    background: transparent;
                    color: ${theme === "dark"
                    ? "#fff"
                    : "#0f172a"};
                }

                input::placeholder {
                    color: ${theme === "dark"
                    ? "#94a3b8"
                    : "#64748b"};
                }

                button {
                    cursor: pointer;
                }

                .button {
                    background-color: #22c55e;
                    color: white;
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    margin-top: 8px;
                    border: none;
                    font-weight: 700;
                }

                .altButton {
                    background-color: transparent;
                    color: ${theme === "dark"
                    ? "#fff"
                    : "#0f172a"};
                    margin-top: 12px;
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    border: 1px solid
                        ${theme === "dark"
                    ? "#334155"
                    : "#cbd5f5"};
                    font-weight: 700;
                }

                .errorText {
                    color: #ef4444;
                    font-size: 13px;
                    text-align: left;
                    margin: -12px 0 8px 0;
                }
            `}</style>
        </div>
    );
}
