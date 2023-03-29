import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

//Import routers
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";

//Connect database
import connectDB from "./db.js";
connectDB();

// App
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
