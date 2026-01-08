import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import { connectDB } from './config/mognoose.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import connectionRouter from './routes/connectionRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import cors from "cors";
import http from "http";
import intialiseSocket from "./utils/socket.js";


const app = express();
const server = http.createServer(app);
intialiseSocket(server);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 3000;



app.use("/user", userRouter)
app.use("/connection", connectionRouter)
app.use("/chat", chatRouter)

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed");
    console.error(err);
})
