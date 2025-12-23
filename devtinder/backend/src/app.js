import express from 'express'
import { connectDB } from './config/mognoose.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import connectionRouter from './routes/connectionRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;



app.use("/user",userRouter)
app.use("/connection",connectionRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed");
    console.error(err);
})
