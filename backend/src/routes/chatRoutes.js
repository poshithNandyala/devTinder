import { Router } from "express";
import Chat from "../models/Chat.js";
import Connection from "../models/connection.js";
import userauth from "../middlewares/userauth.js";

const router = Router();

// helper to keep participant IDs sorted consistently
const sortParticipants = (id1, id2) => [id1.toString(), id2.toString()].sort();

// get chat history with a specific user (paginated)
// socket handles real-time, this is for loading old messages
router.get("/messages/:userId", userauth, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);

        // verify connection exists
        const connection = await Connection.findOne({
            $or: [
                { fromId: currentUserId, toId: userId, status: "accepted" },
                { fromId: userId, toId: currentUserId, status: "accepted" }
            ]
        });

        if (!connection) {
            return res.status(403).json({ message: "Not connected" });
        }

        const sortedParticipants = sortParticipants(currentUserId, userId);
        const chat = await Chat.findOne({ participants: { $all: sortedParticipants } });

        if (!chat) {
            return res.json({ messages: [], hasMore: false });
        }

        // paginate from newest to oldest
        const total = chat.messages.length;
        const start = Math.max(0, total - (page * limit));
        const end = total - ((page - 1) * limit);
        const messages = chat.messages.slice(start, end);

        res.json({
            messages,
            hasMore: start > 0,
            total
        });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to load messages" });
    }
});

// get all chats for inbox view
router.get("/all", userauth, async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const chats = await Chat.find({ participants: currentUserId })
            .populate("participants", "name photoUrl")
            .sort({ "lastMessage.timestamp": -1 })
            .limit(50);

        const chatList = chats.map(chat => {
            const otherUser = chat.participants.find(
                p => p._id.toString() !== currentUserId.toString()
            );
            const unreadCount = chat.messages.filter(
                m => m.senderId.toString() !== currentUserId.toString() && !m.read
            ).length;

            return {
                chatId: chat._id,
                user: otherUser,
                lastMessage: chat.lastMessage,
                unreadCount
            };
        });

        res.json(chatList);
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({ message: "Failed to load chats" });
    }
});

export default router;
