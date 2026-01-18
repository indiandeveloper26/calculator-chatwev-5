"use client";

import { ChatContext } from "@/app/src/context/chatcontext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default function AudioCall() {
    const { socket, incomingUser, myUsername } = useContext(ChatContext);
    const router = useRouter();

    const pcRef = useRef(null);
    const audioRef = useRef(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const ROOM_ID = "123456"; // same room for both users

    /* ---------------- INIT ---------------- */
    useEffect(() => {
        if (!socket) return;

        socket.emit("join-room", { roomId: ROOM_ID });

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        /* 🎤 Get local audio only */
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                setLocalStream(stream);
                stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            })
            .catch(console.error);

        /* 🔊 Remote audio */
        pc.ontrack = (event) => setRemoteStream(event.streams[0]);

        /* ❄ ICE candidate */
        pc.onicecandidate = (e) => {
            if (e.candidate)
                socket.emit("webrtc-candidate", { roomId: ROOM_ID, candidate: e.candidate });
        };

        /* ---------------- SOCKET EVENTS ---------------- */
        socket.on("webrtc-offer", async ({ sdp }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription({ type: "offer", sdp });
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit("webrtc-answer", { roomId: ROOM_ID, sdp: answer.sdp });
        });

        socket.on("webrtc-answer", async ({ sdp }) => {
            if (!pcRef.current) return;
            if (pcRef.current.signalingState === "have-local-offer") {
                await pcRef.current.setRemoteDescription({ type: "answer", sdp });
            }
        });

        socket.on("webrtc-candidate", async ({ candidate }) => {
            if (!pcRef.current) return;
            try {
                await pcRef.current.addIceCandidate(candidate);
            } catch (err) {
                console.error(err);
            }
        });

        socket.on("end-call", handleEndCall);

        /* ---------------- AUTO OFFER ---------------- */
        const timer = setTimeout(async () => {
            if (!pcRef.current || pcRef.current.signalingState !== "stable") return;
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit("webrtc-offer", { roomId: ROOM_ID, sdp: offer.sdp });
        }, 500);

        return () => {
            clearTimeout(timer);
            cleanupCall();
        };
    }, [socket]);

    /* ---------------- PLAY AUDIO ---------------- */
    useEffect(() => {
        if (audioRef.current && remoteStream) {
            audioRef.current.srcObject = remoteStream;
            audioRef.current.play().catch(() => { });
        }
    }, [remoteStream]);

    /* ---------------- CONTROLS ---------------- */
    const toggleMic = () => {
        const track = localStream?.getAudioTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
    };
    console.log('incominguserdata', incomingUser)
    const handleEndCall = () => {
        console.log('incominguserdata', incomingUser)
        console.log({ roomId: ROOM_ID, to: incomingUser?.from, from: myUsername })
        cleanupCall();
        socket?.emit("end-call", { roomId: ROOM_ID, to: incomingUser?.from, from: myUsername });
        router.push("/chatlist");
    };

    const cleanupCall = () => {
        pcRef.current?.close();
        pcRef.current = null;
        localStream?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        setRemoteStream(null);

        socket?.off("webrtc-offer");
        socket?.off("webrtc-answer");
        socket?.off("webrtc-candidate");
        socket?.off("end-call");
    };

    /* ---------------- UI ---------------- */
    return (
        <div style={{ display: "flex", flexDirection: "column", background: "#000", height: "100vh", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <h2>Audio Room: {ROOM_ID}</h2>
            <p>{remoteStream ? "Call Started 🎧" : "Waiting for other user..."}</p>

            <audio ref={audioRef} autoPlay />

            <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
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
