import express from "express";

import postSchema from "../models/Post.js";
import verifyToken from "../middlewares/auth.js";

const postRouter = express.Router();

// @route GET api/posts
// @desc Get posts
// @access Private
postRouter.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await postSchema
      .find({ user: req.userId })
      .populate("user", ["username"]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/posts
// @desc POST posts
// @access Private
postRouter.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // simple validation
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }
  try {
    const newPost = new postSchema({
      title,
      description,
      url: url.startsWith("http://") ? url : `http://${url}`,
      status: status || "TO LEARN ",
      user: req.userId,
    });
    await newPost.save();
    res.json({
      success: true,
      message: "Happy Learning~",
      post: newPost,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
postRouter.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });

  try {
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await postSchema.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // User not authorised to update post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
postRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await postSchema.findOneAndDelete(postDeleteCondition);

    // User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default postRouter;
