import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Connection from "../models/connection.js";

const onlineUsers = new Map();

const getChatRoom = (id1, id2) => {
    if (!id1 || !id2) return null;
    return [id1.toString(), id2.toString()].sort().join("_");
};

const intialiseSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication required"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id || decoded._id;
            if (!socket.userId) {
                return next(new Error("Invalid token payload"));
            }
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.userId;
        
        if (!userId) {
            socket.disconnect();
            return;
        }
        
        onlineUsers.set(userId, socket.id);
        socket.broadcast.emit("userOnline", userId);

        socket.on("joinChat", async ({ otherUserId }, callback) => {
            try {
                if (!otherUserId) {
                    socket.emit("error", { message: "Invalid user" });
                    if (callback) callback({ status: 'error', message: 'Invalid user' });
                    return;
                }

                const connection = await Connection.findOne({
                    $or: [
                        { fromId: userId, toId: otherUserId, status: "accepted" },
                        { fromId: otherUserId, toId: userId, status: "accepted" }
                    ]
                });

                if (!connection) {
                    socket.emit("error", { message: "Not connected with this user" });
                    if (callback) callback({ status: 'error', message: 'Not connected' });
                    return;
                }

                const room = getChatRoom(userId, otherUserId);
                socket.join(room);
                socket.emit("joinedChat", { room });
                if (callback) callback({ status: 'ok', room });

                // mark messages as read
                await Chat.updateOne(
                    { 
                        participants: { 
                            $all: [
                                new mongoose.Types.ObjectId(userId), 
                                new mongoose.Types.ObjectId(otherUserId)
                            ] 
                        } 
                    },
                    { $set: { "messages.$[elem].read": true } },
                    { arrayFilters: [{ "elem.senderId": new mongoose.Types.ObjectId(otherUserId), "elem.read": false }] }
                );
            } catch (err) {
                socket.emit("error", { message: "Failed to join chat" });
                if (callback) callback({ status: 'error', message: 'Failed to join' });
            }
        });

        socket.on("leaveChat", ({ otherUserId }) => {
            if (!otherUserId) return;
            const room = getChatRoom(userId, otherUserId);
            if (room) socket.leave(room);
        });

        // sendMessage with acknowledgement callback
        socket.on("sendMessage", async ({ otherUserId, text }, callback) => {
            console.log("DEBUG BE: sendMessage received, userId:", userId, "otherUserId:", otherUserId, "text:", text?.substring(0,20));
            try {
                if (!otherUserId || !text?.trim()) {
                    console.log("DEBUG BE: Invalid message params");
                    if (callback) callback({ status: 'error', message: 'Invalid message' });
                    return;
                }

                if (text.length > 2000) {
                    if (callback) callback({ status: 'error', message: 'Message too long' });
                    return;
                }

                console.log("DEBUG BE: Finding connection between", userId, "and", otherUserId);
                const connection = await Connection.findOne({
                    $or: [
                        { fromId: userId, toId: otherUserId, status: "accepted" },
                        { fromId: otherUserId, toId: userId, status: "accepted" }
                    ]
                });
                console.log("DEBUG BE: Connection found:", !!connection, connection?._id);

                if (!connection) {
                    console.log("DEBUG BE: No connection found");
                    if (callback) callback({ status: 'error', message: 'Not connected' });
                    return;
                }

                console.log("DEBUG BE: Creating chat...");
                const participantIds = [
                    new mongoose.Types.ObjectId(userId),
                    new mongoose.Types.ObjectId(otherUserId)
                ].sort((a, b) => a.toString().localeCompare(b.toString()));

                // find or create chat first
                let chat = await Chat.findOne({ participants: { $all: participantIds } });
                
                if (!chat) {
                    chat = new Chat({ participants: participantIds, messages: [] });
                }

                // add the message
                chat.messages.push({
                    senderId: new mongoose.Types.ObjectId(userId),
                    text: text.trim(),
                    read: false
                });

                chat.lastMessage = {
                    text: text.trim().substring(0, 100),
                    senderId: new mongoose.Types.ObjectId(userId),
                    timestamp: new Date()
                };

                await chat.save();

                const newMessage = chat.messages[chat.messages.length - 1];
                const room = getChatRoom(userId, otherUserId);

                const messageData = {
                    _id: newMessage._id,
                    senderId: userId,
                    text: newMessage.text,
                    createdAt: newMessage.createdAt,
                    read: newMessage.read
                };

                // broadcast to room
                if (room) {
                    io.to(room).emit("newMessage", messageData);
                }

                // send ack with message data
                if (callback) callback({ status: 'ok', data: messageData });

                // notify other user
                const otherSocketId = onlineUsers.get(otherUserId);
                if (otherSocketId) {
                    io.to(otherSocketId).emit("messageNotification", {
                        fromUserId: userId,
                        preview: text.trim().substring(0, 50)
                    });
                }
            } catch (err) {
                console.log("DEBUG BE: sendMessage CATCH ERROR:", err.message, err.stack);
                if (callback) callback({ status: 'error', message: 'Failed to send' });
            }
        });

        socket.on("typing", ({ otherUserId }) => {
            if (!otherUserId) return;
            const room = getChatRoom(userId, otherUserId);
            if (room) socket.to(room).emit("userTyping", { userId });
        });

        socket.on("stopTyping", ({ otherUserId }) => {
            if (!otherUserId) return;
            const room = getChatRoom(userId, otherUserId);
            if (room) socket.to(room).emit("userStopTyping", { userId });
        });

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("userOffline", userId);
        });
    });

    return io;
};

export default intialiseSocket;
