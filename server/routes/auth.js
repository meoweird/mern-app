import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/auth.js";

import userSchema from "../models/User.js";
const authRouter = express.Router();

authRouter.get("/", verifyToken, async (req, res) => {
  try {
    const user = await userSchema.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    else res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password",
    });
  }
  try {
    const user = await userSchema.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username has already taken",
      });
    }
    //All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new userSchema({
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User has been created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal sever error",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password",
    });
  }

  try {
    const user = await userSchema.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    //All good
    //Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default authRouter;
