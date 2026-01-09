import { Router } from "express";
import Connection from "../models/connection.js";
import userauth from "../middlewares/userauth.js";
import User from "../models/User.js";

const router = Router();

router.post("/send/:status/:id", userauth, async (req, res) => {
    try {
        const { status, id } = req.params;
        const toUserId = id, fromUserId = req.user._id;
        const allowedStatuses = ["request", "ignored"];
        if (!allowedStatuses.includes(status)) res.status(400).send("Invalid status");
        if (toUserId.toString() == fromUserId.toString()) return res.status(400).send("Cannot send connection request to yourself");

        const existingConnection = await Connection.findOne({
            $or: [
                { fromId: fromUserId, toId: toUserId },
                { fromId: toUserId, toId: fromUserId }
            ]
        });
        if (existingConnection) {
            return res.status(400).send("Connection Request Already Exists!!");
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            res.status(404).send("User not found");
        }
        const connection = new Connection({
            fromId: fromUserId,
            toId: toUserId,
            status: status
        });
        await connection.save();
        res.status(200).send(` ${req.user.name} sent a connection request ${status} to ${toUser.name} `);
    }
    catch (err) {
        res.status(500).send("Error sending connection request" + err.message);

    }
})

router.get("/getallrequests", userauth, async (req, res) => {
    try {
        const requests = await Connection.find({ toId: req.user._id, status: "request" }).populate("fromId", "name age gender photoUrl about skills").select("fromId status");
        //  const updated = requests.map((req) => {
        //     return req.fromId;
        // });
        res.status(200).send(requests);
    }
    catch (err) {
        res.status(500).send("something went wrong" + err.message);
    }

})

router.patch("/review/:status/:id", userauth, async (req, res) => {
    try {
        const { status, id } = req.params;

        const allowedStatuses = ["accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const connection = await Connection.findById(id).populate("fromId", "name age gender");
        if (!connection || connection.status !== "request") {
            return res.status(404).send("Connection not found");
        }

        connection.status = status;
        await connection.save();

        res.status(200).send(`${req.user.name} ${status} the connection request from ${connection.fromId.name}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong" + err.message);
    }
});

router.get("/sentrequests", userauth, async (req, res) => {
    try {
        const sentRequests = await Connection.find({ 
            fromId: req.user._id 
        }).populate("toId", "name age gender photoUrl about skills college company");

        const categorized = {
            pending: [],
            accepted: [],
            rejected: [],
            ignored: []
        };

        sentRequests.forEach((connection) => {
            const requestData = {
                _id: connection._id,
                user: connection.toId,
                status: connection.status,
                createdAt: connection.createdAt
            };

            if (connection.status === "request") {
                categorized.pending.push(requestData);
            } else if (connection.status === "accepted") {
                categorized.accepted.push(requestData);
            } else if (connection.status === "rejected") {
                categorized.rejected.push(requestData);
            } else if (connection.status === "ignored") {
                categorized.ignored.push(requestData);
            }
        });

        res.status(200).json(categorized);
    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});

router.delete("/remove/:id", userauth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const connection = await Connection.findOne({
            _id: id,
            $or: [{ fromId: userId }, { toId: userId }]
        });

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        await Connection.findByIdAndDelete(id);
        res.status(200).json({ message: "Connection removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong: " + err.message });
    }
});

router.get("/allconnections", userauth, async (req, res) => {
    try {
        let connections = await Connection.find({ $or: [{ fromId: req.user._id, status: "accepted" }, { toId: req.user._id, status: "accepted" }] }).populate("fromId", "name age gender photoUrl about skills college company githubId linkedinId").populate("toId", "name age gender photoUrl about skills college company githubId linkedinId");

        let newconnections = connections.map((connection) => {
            const user = connection.fromId._id.toString() == req.user._id.toString() 
                ? connection.toId 
                : connection.fromId;
            return {
                connectionId: connection._id,
                ...user.toObject()
            };
        });

        res.status(200).send(newconnections);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})

// router.get("/feed", userauth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).send(users);
//     } catch (err) {
//         res.status(500).send("Something went wrong");
//     }
// })

router.get("/feed", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 100;
        limit = Math.min(limit, 50);
        const skip = (page - 1) * limit;

        // Filters
        const { skills, college } = req.query;

        const connectionRequests = await Connection.find({
            $or: [{ fromId: loggedInUser._id }, { toId: loggedInUser._id }],
        }).select("fromId toId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromId.toString());
            hideUsersFromFeed.add(req.toId.toString());
        });

        const query = {
            _id: { $nin: Array.from(hideUsersFromFeed), $ne: loggedInUser._id },
        };

        // Filter by user's gender preference (interestedIn)
        if (loggedInUser.interestedIn && loggedInUser.interestedIn.length > 0) {
            query.gender = { $in: loggedInUser.interestedIn };
        }

        if (skills) {
            const skillsArray = skills.split(",").map(skill => skill.trim());
            query.skills = { $in: skillsArray }; // Users having at least one of the skills
        }

        if (college) {
            query.college = { $regex: college, $options: "i" }; // Case-insensitive partial match
        }

        const users = await User.find(query)
            .select("name age gender photoUrl about skills college company githubId linkedinId")
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
