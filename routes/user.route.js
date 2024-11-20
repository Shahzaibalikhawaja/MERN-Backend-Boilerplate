import express from "express";
import { test, getUsers, getUser, updateName, updatePassword, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Test Route
router.route("/test").get(test);

// User Management Routes
router.route("/users").get(verifyJWT, getUsers);
router.route("/user/:id").get(verifyJWT, getUser);
router.route("/user/:id").put(verifyJWT, updateName);
router.route("/user/:id").delete(verifyJWT, deleteUser);
router.route("/user/password/:id").put(verifyJWT, updatePassword);

export default router;
