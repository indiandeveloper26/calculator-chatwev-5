"use client";


import { ChatContext } from "@/app/src/context/chatcontext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default function AudioCall() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);

    const pc = useRef(null);
    const audioRef = useRef(null);

    const { socket, incomingUser, myUsername } = useContext(ChatContext);
    const ROOM_ID = "123456";
    const router = useRouter();

    useEffect(() => {
        if (!socket) return;

        socket.emit("join-room", { roomId: ROOM_ID });

        pc.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // 🎤 AUDIO ONLY
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                setLocalStream(stream);
                stream.getTracks().forEach((track) =>
                    pc.current.addTrack(track, stream)
                );
            });

        pc.current.ontrack = (e) => {
            setRemoteStream(e.streams[0]);
        };

        pc.current.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("webrtc-candidate", {
                    roomId: ROOM_ID,
                    candidate: e.candidate,
                });
            }
        };

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
            await pc.current.addIceCandidate(candidate);
        });

        socket.on("end-call", endCall);

        setTimeout(async () => {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
        }, 1000);

        return () => cleanup();
    }, [socket]);

    useEffect(() => {
        if (audioRef.current && remoteStream) {
            audioRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMic = () => {
        const track = localStream?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        }
    };

    const cleanup = () => {
        pc.current?.close();
        localStream?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        setRemoteStream(null);
    };

    const endCall = () => {
        socket.emit("end-call", {
            roomId: ROOM_ID,
            // to: incomingUser.from,
            // from: myUsername,
        });

        pc.current?.close();
        localStream?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        setRemoteStream(null);

        router.push("/chatlist");


    };

    return (
        <div style={styles.container}>
            {/* 🔊 Remote Audio */}
            <audio ref={audioRef} autoPlay />

            {/* 👤 Profile */}
            <div style={styles.profile}>
                <div style={styles.avatar}>
                    {incomingUser?.from?.charAt(0)?.toUpperCase()}
                </div>
                <h2>{incomingUser?.from}</h2>
                <p>Audio Calling...</p>
            </div>

            {/* 🎛 Controls */}
            <div style={styles.controls}>
                <button onClick={toggleMic} style={styles.mute}>
                    {isMuted ? "Unmute" : "Mute"}
                </button>
                <button onClick={endCall} style={styles.end}>
                    End
                </button>
            </div>
        </div>
    );
}

/* 🎨 UI Styles */
const styles = {
    container: {
        height: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 20px",
    },
    profile: {
        textAlign: "center",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "#1db954",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        fontWeight: "bold",
        marginBottom: 20,
    },
    controls: {
        display: "flex",
        gap: 20,
    },
    mute: {
        padding: "15px 30px",
        borderRadius: 50,
        background: "#444",
        color: "#fff",
        border: "none",
        fontSize: 16,
    },
    end: {
        padding: "15px 30px",
        borderRadius: 50,
        background: "red",
        color: "#fff",
        border: "none",
        fontSize: 16,
    },
};
