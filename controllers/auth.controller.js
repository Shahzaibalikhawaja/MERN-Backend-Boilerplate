// controllers/auth.controller.js
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("ERROR = ", error);
        return res.status(500).json({
            message: "Something went wrong while generating Access and Refresh Tokens",
            error,
        });
    }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Refresh token is missing" });
        }

        // Verify the refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find the user
        const user = await User.findById(decodedToken._id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        // Send new tokens as cookies
        res.status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true })
            .json({
                message: "Access token refreshed",
                tokens: { accessToken, refreshToken: newRefreshToken },
            });
    } catch (error) {
        console.error("ERROR in refreshAccessToken:", error);
        res.status(401).json({ message: "Failed to refresh access token", error });
    }
};

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // Return response
        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email },
            tokens: { accessToken, refreshToken },
        });
    } catch (error) {
        console.error("ERROR in registerUser:", error);
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // Send tokens as cookies
        res.status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
            .json({
                message: "Login successful",
                user: { id: user._id, name: user.name, email: user.email },
                tokens: { accessToken, refreshToken },
            });
    } catch (error) {
        console.error("ERROR in loginUser:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};

// Logout a user
export const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Clear refreshToken in the database
        await User.findByIdAndUpdate(userId, { $unset: { refreshToken: "" } });

        // Clear cookies
        res.status(200)
            .clearCookie("accessToken", { httpOnly: true, secure: true })
            .clearCookie("refreshToken", { httpOnly: true, secure: true })
            .json({ message: "Logout successful" });
    } catch (error) {
        console.error("ERROR in logoutUser:", error);
        res.status(500).json({ message: "Logout failed", error });
    }
};