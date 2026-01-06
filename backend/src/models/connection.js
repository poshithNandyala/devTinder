import { mongoose } from "mongoose";
const connectionSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
