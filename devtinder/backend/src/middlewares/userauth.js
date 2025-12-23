import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const userauth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, "poshith");
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send("Unauthorized: User not found");
        }

        req.user = user; 
        next();
    } catch (err) {
        return res.status(401).send("Unauthorized: Invalid token");
    }
};
export default userauth;
