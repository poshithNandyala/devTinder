// import http from 'http'

// const server = http.createServer((req, res) => {
//     console.log("server is running");
//     res.end("Hello World")
// })

// server.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// })


// http.createServer((req, res) => {
//   if (req.url === '/') {
//     res.end('Home Page');
//   } else if (req.url === '/about') {
//     res.end('About Page');
//   } else {
//     res.end('404 Not Found');
//   }
// }).listen(3000);

import express from 'express'
import { userauth } from './middlewares/userauth.js'
import { connectDB } from './config/mognoose.js';
import User from './models/User.js';
const app = express();
const PORT = 3000;


// app.use("/signin", (req, res, next) => {
//     console.log("response 1")
//     next();
// }, (req, res, next) => {
//     console.log("response 2");
//     res.send("hi from signin")
// }
// )
// app.use("/home", userauth, (req, res) => {
//     res.send("hi from home")
//     console.log("home page is running")
// })

// app.use("/about", (req, res) => {
//     res.send("hi from about")
//     console.log("about page is running")
// })

app.use(express.json());
app.post("/signup", async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send("Error creating user");
    }
    
})
app.get("/byemail", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    res.send(user);
})

app.get("/feed", async (req, res) => {
    const user = await User.find();
    res.send(user);
})

app.delete("/user", async (req, res) => {
    await User.findByIdAndDelete(req.body.id);
    res.send("User deleted successfully");
})
app.get("/", (req, res) => {
    res.send("Hellooooo World");
})
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed");
    console.error(err);
})
