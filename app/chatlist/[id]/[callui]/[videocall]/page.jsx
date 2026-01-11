// "use client";

// import { ChatContext } from '@/app/src/context/chatcontext';
// import { useRouter } from "next/navigation";
// import { useContext, useEffect, useRef, useState } from "react";

// export default function VideoCall() {
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [isMuted, setIsMuted] = useState(false);
//     const pc = useRef(null);

//     const { socket, incomingUser } = useContext(ChatContext);

//     console.log('dtatda', incomingUser.roomId)


//     // const ROOM_ID = incomingUser.roomId;

//     const ROOM_ID = '123456'

//     useEffect(() => {
//         if (!socket) return;

//         // 1️⃣ Initialize peer connection
//         const pcInstance = new RTCPeerConnection({
//             iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         });
//         pc.current = pcInstance;

//         // 2️⃣ Get local media
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then(stream => {
//                 setLocalStream(stream);
//                 stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
//             })
//             .catch(err => console.error("Error getting media:", err));

//         // 3️⃣ Peer connection events
//         pc.current.ontrack = (event) => {
//             setRemoteStream(event.streams[0]);
//         };

//         pc.current.onicecandidate = (e) => {
//             if (e.candidate) {
//                 socket.emit("webrtc-candidate", { roomId: ROOM_ID, candidate: e.candidate });
//             }
//         };

//         // 4️⃣ Socket events
//         socket.on("webrtc-offer", async ({ sdp }) => {
//             await pc.current.setRemoteDescription({ type: "offer", sdp });
//             const answer = await pc.current.createAnswer();
//             await pc.current.setLocalDescription(answer);
//             socket.emit("webrtc-answer", { roomId: ROOM_ID, sdp: answer.sdp });
//         });

//         socket.on("webrtc-answer", async ({ sdp }) => {
//             await pc.current.setRemoteDescription({ type: "answer", sdp });
//         });

//         socket.on("webrtc-candidate", async ({ candidate }) => {
//             try { await pc.current.addIceCandidate(candidate); } catch (err) { console.error(err); }
//         });

//         socket.on("end-call", endCall);

//         // // 5️⃣ Join room and create offer automatically
//         socket.emit("join-room", { roomId: ROOM_ID });

//         const timer = setTimeout(async () => {
//             const offer = await pc.current.createOffer();
//             await pc.current.setLocalDescription(offer);
//             socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
//         }, 1000);

//         // Cleanup on unmount
//         return () => {
//             clearTimeout(timer);
//             pc.current.close();
//             localStream?.getTracks().forEach(track => track.stop());
//             socket.off("webrtc-offer");
//             socket.off("webrtc-answer");
//             socket.off("webrtc-candidate");
//             socket.off("end-call");
//         };
//     }, [socket]);

//     // Toggle microphone
//     const toggleMic = () => {

//         console.log('togle button now')
//         const audioTrack = localStream?.getAudioTracks()[0];
//         if (audioTrack) {
//             audioTrack.enabled = !audioTrack.enabled;
//             setIsMuted(!audioTrack.enabled);
//         }
//     };

//     let route = useRouter()

//     // End call
//     const endCall = () => {
//         route.push('/chatlist');
//         pc.current?.close();
//         localStream?.getTracks().forEach(track => track.stop());
//         socket.emit("end-call", { roomId: ROOM_ID });
//         setRemoteStream(null);
//         setLocalStream(null);


//     };

//     return (
//         <div style={{ display: "flex", flexDirection: "column", background: "#000", height: "100vh" }}>
//             <video
//                 style={{ flex: 1 }}
//                 autoPlay
//                 playsInline
//                 ref={video => { if (video && remoteStream) video.srcObject = remoteStream }}
//             />
//             <video
//                 style={{ width: 200, height: 150, position: "absolute", right: 20, top: 20, border: "2px solid white", borderRadius: 8 }}
//                 autoPlay
//                 muted
//                 playsInline
//                 ref={video => { if (video && localStream) video.srcObject = localStream }}
//             />
//             {/* Buttons */}
//             <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
//                 <button onClick={toggleMic} style={{ padding: "12px 30px", backgroundColor: "green", borderRadius: 50, color: "#fff", border: "none" }}>
//                     {isMuted ? "Unmute" : "Mute"}
//                 </button>
//                 <button onClick={endCall} style={{ padding: "12px 30px", backgroundColor: "red", borderRadius: 50, color: "#fff", border: "none" }}>
//                     End Call
//                 </button>
//             </div>
//         </div>
//     );
// }









"use client";

import { ChatContext } from '@/app/src/context/chatcontext';
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default function VideoCall() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const pc = useRef(null);

    const { socket, incomingUser } = useContext(ChatContext);
    const ROOM_ID = incomingUser?.roomId || '123456';
    const router = useRouter();

    useEffect(() => {
        if (!socket) return;

        // 1️⃣ Initialize peer connection
        const pcInstance = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pc.current = pcInstance;

        // 2️⃣ Get local media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
            })
            .catch(err => console.error("Error getting media:", err));

        // 3️⃣ Peer connection events
        pc.current.ontrack = (event) => setRemoteStream(event.streams[0]);
        pc.current.onicecandidate = (e) => {
            if (e.candidate) socket.emit("webrtc-candidate", { roomId: ROOM_ID, candidate: e.candidate });
        };

        // 4️⃣ Socket events
        socket.on("webrtc-offer", async ({ sdp }) => {
            await pc.current.setRemoteDescription({ type: "offer", sdp });
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            socket.emit("webrtc-answer", { roomId: ROOM_ID, sdp: answer.sdp });
        });

        socket.on("webrtc-answer", async ({ sdp }) => {
            await pc.current.setRemoteDescription({ type: "answer", sdp });
        });

        socket.on("webrtc-candidate", async ({ candidate }) => {
            try { await pc.current.addIceCandidate(candidate); } catch (err) { console.error(err); }
        });

        socket.on("end-call", handleEndCall);

        // 5️⃣ Join room and create offer automatically
        socket.emit("join-room", { roomId: ROOM_ID });

        const timer = setTimeout(async () => {
            if (pc.current) {
                const offer = await pc.current.createOffer();
                await pc.current.setLocalDescription(offer);
                socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
            }
        }, 1000);

        // Cleanup on unmount
        return () => {
            clearTimeout(timer);
            cleanupCall();
        };
    }, [socket]);

    // ✅ Cleanup function
    const cleanupCall = () => {
        if (pc.current) {
            pc.current.getSenders().forEach(sender => sender.track?.stop());
            pc.current.close();
            pc.current = null;
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        setLocalStream(null);
        setRemoteStream(null);

        socket?.off("webrtc-offer");
        socket?.off("webrtc-answer");
        socket?.off("webrtc-candidate");
        socket?.off("end-call");
    };

    const handleEndCall = () => {
        cleanupCall();
        socket?.emit("end-call", { roomId: ROOM_ID });
        router.push('/chatlist');
    };

    const toggleMic = () => {
        const audioTrack = localStream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", background: "#000", height: "100vh" }}>
            <video
                style={{ flex: 1 }}
                autoPlay
                playsInline
                ref={video => { if (video && remoteStream) video.srcObject = remoteStream }}
            />
            <video
                style={{
                    width: 200,
                    height: 150,
                    position: "absolute",
                    right: 20,
                    top: 20,
                    border: "2px solid white",
                    borderRadius: 8
                }}
                autoPlay
                muted
                playsInline
                ref={video => { if (video && localStream) video.srcObject = localStream }}
            />

            {/* Buttons */}
            <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
                <button onClick={toggleMic} style={{ padding: "12px 30px", backgroundColor: "green", borderRadius: 50, color: "#fff", border: "none" }}>
                    {isMuted ? "Unmute" : "Mute"}
                </button>
                <button onClick={handleEndCall} style={{ padding: "12px 30px", backgroundColor: "red", borderRadius: 50, color: "#fff", border: "none" }}>
                    End Call
                </button>
            </div>
        </div>
    );
}
