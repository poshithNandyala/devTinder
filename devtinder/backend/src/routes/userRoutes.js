import { Router } from "express";
const router = Router();

import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import userauth from "../middlewares/userauth.js";

router.post("/signup", async (req, res) => {
    try {
        console.log(req.body);
        let { name, email, password, gender, age } = req.body;
        if (!name || !email || !password || !gender || !age) return res.status(400).send("provide name, email, password, gender, age")
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
        const token = await user.getJWTToken();
        res.cookie("token", token);
        res.send(user);
    } catch (err) {
        res.status(500).send("Error creating user " + err.message);
    }

})

router.post("/login", async (req, res) => {
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
        res.send(user);
    } catch (err) {
        res.status(500).send("Error logging in");
    }
})

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.send("Logout successful");
    } catch (err) {
        res.status(500).send("Error logging out");
    }
})
router.get("/profile/:id", userauth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.send(user);
    } catch (err) {
        res.status(500).send("Error fetching profile");
    }
})
router.get("/profile", userauth, (req, res) => {
    try {
        const user = req?.user;
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Error fetching profile" + err.message);
    }
})



router.patch("/update", userauth, async (req, res) => {
    try {
        const editableFields = ["name", "gender", "age"];
        const { name, gender, age } = req.body;
        // console.log(name + " "+ gender +" "+age)
        const user = await User.findByIdAndUpdate(req.user._id, { name, gender, age }, { new: true });
        res.send(user);
    } catch (err) {
        res.status(500).send("Error updating profile" + err.message);
    }
})

router.put("/updatepassword", userauth, async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;
        const user = await User.findById(req.user._id);
        const isPasswordValid = await user.comparepassword(oldpassword);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid old password");
        }
        user.password = await bcrypt.hash(newpassword, 10);
        await user.save();
        res.send("Password updated successfully");
    } catch (err) {
        res.status(500).send("Error updating password");
    }
})

export default router;