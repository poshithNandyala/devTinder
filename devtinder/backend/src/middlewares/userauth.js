import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const userauth = (req, res, next) => {
    const token= req.cookies.token;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }
    jwt.verify(token, "poshith", (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.user = User.findById(decoded.id);
        next();
    });
}

export default userauth;
