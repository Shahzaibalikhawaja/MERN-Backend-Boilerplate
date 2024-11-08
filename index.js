import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./database/db.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(morgan("tiny"));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(
    express.json({
        limit: "16kb",
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

// Routes
app.use("/api/v1", userRouter);

app.use("*", (req, res) => res.status(404).json({ error: "ROUTE NOT FOUND", code: 404 }));

// Database connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!", err);
    });
