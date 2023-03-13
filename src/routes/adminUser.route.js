const express = require('express');
const adminAuth = require("../middlewares/adminAuth");
const User = require('../models/user.model');
const services = require('../services/user.service');
const services = require('../services/post.service');

const router = express.Router();

// Route to create a new user
router.post('/users', adminAuth, async (req, res) => {
  try {
    res.status(201).json({ message: 'user created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update an existing user
router.put('/user/:id', adminAuth, async (req, res) => {
  try {
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to delete an existing user
router.delete('/user/:id', adminAuth, async (req, res) => {
  try {
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
