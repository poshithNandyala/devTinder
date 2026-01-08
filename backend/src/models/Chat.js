import mongoose from "mongoose";

// each message lives inside a conversation between two users
// indexed for fast lookups when loading chat history
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 2000 // keep messages reasonable
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// conversation between exactly two users
// participants array always has 2 user IDs, sorted for consistent lookups
const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageSchema],
    lastMessage: {
        text: String,
        senderId: mongoose.Schema.Types.ObjectId,
        timestamp: Date
    }
}, { timestamps: true });

// compound index for finding chats between two specific users quickly
chatSchema.index({ participants: 1 });

// handy method to get the other person in the chat
chatSchema.methods.getOtherParticipant = function(userId) {
    return this.participants.find(p => p.toString() !== userId.toString());
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
