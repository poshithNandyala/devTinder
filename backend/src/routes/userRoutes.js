import { Router } from "express";
const router = Router();

import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import userauth from "../middlewares/userauth.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

router.post("/signup", upload.single("photo"), async (req, res) => {
    try {
        let { name, email, password, gender, age, skills, college, company, about, githubId, linkedinId } = req.body;

        if (skills && typeof skills === 'string') {
            skills = skills.split(',').map(skill => skill.trim());
        }

        if (!name || !email || !password || !gender || !age) return res.status(400).send("provide name, email, password, gender, age")
        if (!validator.isEmail(email)) {
            return res.status(400).send("Invalid email");
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).send("Weak password");
        }

        let photoUrl;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            photoUrl = result.secure_url;
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("File cleanup failed:", err);
            });
        }

        password = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password,
            gender,
            age,
            skills,
            college,
            company,
            about,
            githubId,
            linkedinId,
            photoUrl
        });
        await user.save();
        const token = user.getJWTToken();
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
        const token = user.getJWTToken();
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



router.patch("/update", userauth, upload.single("photo"), async (req, res) => {
    try {
        let { name, gender, age, skills, college, company, about, githubId, linkedinId, interestedIn } = req.body;


        if (interestedIn && typeof interestedIn === 'string') {
            interestedIn = interestedIn.split(',').map(i => i.trim()).filter(i => ['male', 'female', 'other'].includes(i));
        }

        const updates = { name, gender, age, skills, college, company, about, githubId, linkedinId, interestedIn };


        if (skills && typeof skills === 'string') {
            updates.skills = skills.split(',').map(skill => skill.trim());
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updates.photoUrl = result.secure_url;
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("File cleanup failed:", err);
            });

        }


        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
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