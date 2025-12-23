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
        const requests = await Connection.find({ toId: req.user._id }).populate("fromId", "name age").select("fromId");
        //  const updated = requests.map((req) => {
         //     return req.fromId;
         // });
        res.status(200).send(requests);
    }
    catch (err) {
        res.status(500).send("something went wrong" +err.message);
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
        res.status(500).send("Something went wrong"  +err.message );
    }
});

router.get("/allconnections", userauth, async (req, res) => {
    try {
        let connections = await Connection.find({ $or: [{ fromId: req.user._id  ,status:"accepted"}, { toId: req.user._id ,status:"accepted"}] }).populate("fromId", "name age gender").populate("toId", "name age gender");

        let newconnections = connections.map((connection) => {
            if (connection.fromId._id.toString() == req.user._id.toString()) {
                return connection.toId;
            } else {
                return connection.fromId;
            }
        });

        res.status(200).send(newconnections);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})

// router.get("/feed", userauth, async (req, res) => {
//     try {

//         res.status(200).send(user);
//     } catch (err) {
//         res.status(500).send("Something went wrong");
//     }
// })

router.get("/feed", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50);
        const skip = (page - 1) * limit;

        const connectionRequests = await Connection.find({
            $or: [{ fromId: loggedInUser._id }, { toId: loggedInUser._id }],
        }).select("fromId toId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromId.toString());
            hideUsersFromFeed.add(req.toId.toString());
        });

        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed), $ne: loggedInUser._id },
        })
            .select("name age gender")
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
