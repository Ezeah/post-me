const express = require("express");
const User = require("../models/user.model");
const validate = require("../middlewares/validate.middleware");
const adminauth = require("../middlewares/adminAuth.middleware");
const userauth = require("../middlewares/userauth.middleware")
const services = require('../services/user.service');
const router = express.Router()

// Route for user signup
router.post("/signup", validate, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Get a single user by id
router.get("/users/:id", validate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Update or replace user
router.put("/users/:id", userauth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update));
    if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Soft delete a user
router.delete("/users/:id", userauth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    user.isDeleted = true;
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// Get a user's handle by id
router.get("/users/:id/handle", validate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("handle");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a user's handle and posts by id
router.get("/users/:id/handle/posts", validate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

  