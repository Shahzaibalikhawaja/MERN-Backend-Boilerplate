// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token is missing" });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }
        const user = await User.findById(decodedToken.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token or user not found" });
        }
        req.user = user; // Attach user data to req.user so APIs can use it
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            error: error?.message,
        });
    }
};
