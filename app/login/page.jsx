
// "use client";
// import { useState, useContext } from "react";
// import Image from "next/image";
// // static image in /assets
// import { useRouter } from "next/navigation"

// import api from "@/app/src/api";
// import { ChatContext } from "@/app/src/context/chatcontext";


// export default function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);

//     const router = useRouter();
//     const { setMyUsername, login, setLogin, updatePremium } = useContext(ChatContext);

//     const validate = () => {
//         const newErrors = {};
//         if (!username.trim()) newErrors.username = "Username is required";
//         if (!password) newErrors.password = "Password is required";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleLogin = async () => {
//         if (!validate()) return;
//         setLoading(true);

//         try {
//             const { data } = await api.post("/log", {
//                 username: username.toLowerCase(),
//                 password,
//             });

//             if (data.token) localStorage.setItem("tokenn", data.token);
//             if (data.user?.username) {
//                 localStorage.setItem("username", data.user.username);
//                 setMyUsername(data.user.username);
//             }

//             if (data.userdata) {
//                 if (data.userdata.premiumExpiry)
//                     localStorage.setItem("premiumExpiry", data.userdata.premiumExpiry);
//                 if (data.userdata.isPremium !== undefined) {
//                     localStorage.setItem("isPremium", data.userdata.isPremium.toString());
//                     updatePremium(data.userdata.isPremium, data.userdata.premiumExpiry);
//                 }
//             }

//             alert("✅ Login Successful!");
//             setLogin(true);
//             router.push("/chatlist"); // redirect to chat page
//         } catch (err) {
//             console.log(err);
//             alert("❌ Invalid username or password");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
//                 {/* Background Image */}
//                 <div className="absolute top-0 left-0 w-full h-full -z-10 rounded-2xl overflow-hidden">
//                     <Image src={'/login.jpg'} alt="Login Background" layout="fill" objectFit="cover" />
//                     <div className="absolute inset-0 bg-black/50"></div>
//                 </div>

//                 {/* Logo */}
//                 <div className="flex justify-center mb-6">
//                     <Image src={'/login.jpg'} alt="Logo" width={220} height={150} className="rounded-xl" />
//                 </div>

//                 <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome 👋</h1>
//                 <p className="text-center text-gray-300 mb-6">Sign in to continue chatting</p>

//                 {/* Username */}
//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => {
//                             setUsername(e.target.value);
//                             if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
//                         }}
//                         className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4 relative">
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => {
//                             setPassword(e.target.value);
//                             if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
//                         }}
//                         className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-gray-600"
//                     >
//                         {showPassword ? "Hide" : "Show"}
//                     </button>
//                     {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//                 </div>

//                 {/* Login Button */}
//                 <button
//                     onClick={handleLogin}
//                     disabled={loading}
//                     className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
//                 >
//                     {loading ? "Loading..." : "Login"}
//                 </button>

//                 {/* Signup Button */}
//                 <button
//                     onClick={() => router.push("/singup")}
//                     className="w-full py-3 mt-2 bg-white text-blue-600 rounded-lg border border-gray-300 hover:bg-gray-100"
//                 >
//                     Create Account
//                 </button>
//             </div>
//         </div>
//     );
// }







"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/app/src/api";
import { ChatContext } from "@/app/src/context/chatcontext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleClick = ({ data = 'error aya ', type }) => {

        console.log(type)

        if (type === "Successful") {
            toast.success('success'); // Success type

        }
        else {
            toast.error(data);
        }


        // Info type
        console.log("Box clicked!", data, type);
    };

    const router = useRouter();
    const {
        setMyUsername,
        setLogin,
        updatePremium,
        theme,
    } = useContext(ChatContext);

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
                if (data.userdata.premiumExpiry) {
                    localStorage.setItem(
                        "premiumExpiry",
                        data.userdata.premiumExpiry
                    );
                }
                if (data.userdata.isPremium !== undefined) {
                    localStorage.setItem(
                        "isPremium",
                        data.userdata.isPremium.toString()
                    );
                    updatePremium(
                        data.userdata.isPremium,
                        data.userdata.premiumExpiry
                    );
                }
            }

            // alert("✅ Login Successful!");
            // handleClick("Login Successful!")
            handleClick({ data: "Login Successful!", type: "Successful" })
            setLogin(true);
            router.push("/chatlist");
        } catch (err) {
            console.log('error', err?.response?.data?.message);
            // alert("❌ Invalid username or password");
            handleClick({ data: err?.response?.data?.message, type: "error" })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`flex items-center justify-center min-h-screen
            ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
        >
            <div
                className={`relative w-full max-w-md p-8 rounded-2xl shadow-lg
                ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
                {/* Background Image */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 rounded-2xl overflow-hidden">
                    <Image
                        src="/login.jpg"
                        alt="Login Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/login.jpg"
                        alt="Logo"
                        width={220}
                        height={150}
                        className="rounded-xl"
                    />
                </div>

                <h1
                    className={`text-3xl font-bold text-center mb-2
                    ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                    Welcome 👋
                </h1>

                <p
                    className={`text-center mb-6
                    ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
                >
                    Sign in to continue chatting
                </p>

                {/* Username */}
                <div className="mb-4">
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
                        className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2
                        ${theme === "dark"
                                ? "bg-gray-700 text-white border-gray-600 focus:ring-green-500"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
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
                        className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2
                        ${theme === "dark"
                                ? "bg-gray-700 text-white border-gray-600 focus:ring-green-500"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-3 text-sm
                        ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-70 transition"
                >
                    {loading ? "Loading..." : "Login"}
                </button>

                {/* Signup Button */}
                <button
                    onClick={() => router.push("/singup")}
                    className={`w-full py-3 mt-2 rounded-lg border transition
                    ${theme === "dark"
                            ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                            : "bg-white text-blue-600 border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}
