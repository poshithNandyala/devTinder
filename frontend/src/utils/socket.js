import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = (token) => {
    if (socket?.connected) {
        console.log("DEBUG: Socket already connected");
        return socket;
    }

    // try localStorage first, then cookie
    if (!token) {
        token = localStorage.getItem('token');
        console.log("DEBUG: Token from localStorage:", token ? "found" : "not found");
    }
    if (!token) {
        token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        console.log("DEBUG: Token from cookie:", token ? "found" : "not found");
    }

    if (!token) {
        console.error("DEBUG: No token available for socket");
        return null;
    }
    
    console.log("DEBUG: Connecting socket with token...");

    socket = io(BASE_URL, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on("connect", () => {
        console.log("DEBUG: Socket connected successfully, id:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("DEBUG: Socket connect error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("DEBUG: Socket disconnected:", reason);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
