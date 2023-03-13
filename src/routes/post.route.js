const express = require("express");
const User = require("../models/user.model");
const validate = require("../middlewares/validate.middleware");
const adminauth = require("../middlewares/adminAuth.middleware");
const userauth = require("../middlewares/userauth.middleware")
const services = require("../services/user.service");
const services = require("../services/post.service");
const router = express.Router()

// Route for creating a new post-it
router.post("/post-its", validate, async (req, res) => {
    try {
    const postIt = new postIt({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
    });
    await postIt.save();
    res.status(201).send(postIt);
    } catch (error) {
    console.error(error);
    res.status(400).send();
    }
    });
    
    // Route for updating a post
    router.patch("/post-its/:id", Authenticate, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "content"];
    const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update));
    if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
    }
    try {
    const postIt = await postIt.findOne({ _id: req.params.id, author: req.user._id });
    if (!postIt) {
    return res.status(404).send();
    }
    updates.forEach((update) => (postIt[update] = req.body[update]));
    await postIt.save();
    res.send(postIt);
    } catch (error) {
    console.error(error);
    res.status(500).send();
    }
    });
    
    // Route for deleting a post
    router.delete("/post-its/:id", Authenticate, async (req, res) => {
    try {
    const postIt = await postIt.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!postIt) {
    return res.status(404).send();
    }
    res.send(postIt);
    } catch (error) {
    console.error(error);
    res.status(500).send();
    }
    });
    
    // Route for creating a reply to a post
    router.post("/post-its/:id/replies", validate, async (req, res) => {
    try {
    const postIt = await postIt.findById(req.params.id);
    if (!postIt) {
    return res.status(404).send();
    }
    const reply = new Reply({
    content: req.body.content,
    author: req.user._id,
    postIt: postIt._id
    });
    await reply.save();
    res.status(201).send(reply);
    } catch (error) {
    console.error(error);
    res.status(500).send();
    }
    });
    
    // Route for getting all replies to a post
    router.get("/post-its/:id/replies", async (req, res) => {
    try {
    const replies = await Reply.find({ postIt: req.params.id }).populate("author", "username");
    res.send(replies);
    } catch (error) {
    console.error(error);
    res.status(500).send();
    }
    });
    
    // Route for getting a single reply to a post
    router.get("/replies/:id", async (req, res) => {
    try {
    const reply = await Reply.findById(req.params.id).populate("author", "username");
    if (!reply) {
    return res.status(404).send();
    }
    res.send(reply);
    } catch (error) {
    console.error(error);
    res.status(500).send();
    }
    });
  
  // Route for deleting a reply to a post
  router.delete("/replies/:id", Authenticate, async (req, res) => {
    try {
      const reply = await Reply.findOne({ _id: req.params.id, isDeleted: false });
      if (!reply) {
        return res.status(404).send();
      }
      if (reply.author.toString() !== req.user._id.toString() && reply.parentPost.author.toString() !== req.user._id.toString()) {
        return res.status(403).send(); // User cannot delete another user's reply or a reply to another user's post-it
      }
      reply.isDeleted = true;
      await reply.save();
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });

  // Get posts of a user
router.get("/users/:id/posts", Validate, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      const posts = await Post.find({ author: user._id });
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });
  
  // Get a post by id
  router.get("/posts/:id", Validate, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
  // Get comments for a post
  router.get("/posts/:id/comments", Validate, async (req, res) => {
    try {
      const comments = await Comment.find({ post: req.params.id });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

  module.exports = router;