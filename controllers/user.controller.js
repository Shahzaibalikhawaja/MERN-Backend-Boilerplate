// controllers/user.controller.js
import { User } from "../models/user.model.js";

export const test = (req, res) => {
    try {
        console.log("test");
        res.status(200).send({ message: "test API Works!" });
    } catch (error) {
        console.error("ERROR = ", error);
        return res.status(400).json({
            message: "Something went wrong :(",
            error,
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (error) {
        console.error("ERROR = ", error);
        res.status(500).json({ message: "Failed to retrieve users", error });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("ERROR = ", error);
        res.status(500).json({ message: "Failed to retrieve user", error });
    }
};

export const updateName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(id, { name }, { new: true, runValidators: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Name updated successfully", user });
    } catch (error) {
        console.error("ERROR = ", error);
        res.status(500).json({ message: "Failed to update name", error });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.isPasswordCorrect(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("ERROR = ", error);
        res.status(500).json({ message: "Failed to update password", error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.user._id;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("ERROR = ", error);
        res.status(500).json({ message: "Failed to delete user", error });
    }
};
