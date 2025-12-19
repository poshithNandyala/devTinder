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
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import bcrypt from 'bcrypt';
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
import validator from 'validator';
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {

    try {
        console.log(req.body);
        let { name, email, password, gender, age } = req.body;
        if (!validator.isEmail(email)) {
      
            return res.status(400).send("Invalid email");
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).send("Weak password");
        }
        password = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password,
            gender,
            age,
        });
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(500).send("Error creating user");
    }

})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }
        const isPasswordValid = await user.comparepassword(password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid credentials");
        }
        const token = await user.getJWTToken();
        res.cookie("token", token);
        res.send("Login successful");
    } catch (err) {
        res.status(500).send("Error logging in");
    }
})

app.get("/profile", userauth, async (req, res) => {
    try {
        const user = await req.user;
        res.send(user);
    } catch (err) {
        res.status(500).send("Error fetching profile");
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
