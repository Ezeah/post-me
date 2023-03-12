const express = require('express');
const Joi = require('joi');
const validate = require('../middlewares/validate.middleware');
const userauth = require('../middlewares/userAuth.middleware');
const adminauth = require('./adminAuth.middleware');
const User = require("../models/user.model");

function validateData(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
     next();
  };
}

const router = express.Router();

// Joi schema for validating user registration data
const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Dynamic validation middleware for user registration data
const validateRegistrationData = validateData(registerSchema);

// Route to register a new user
router.post('/signup', validateRegistrationData, async (req, res) => {
  try {
    // User registration logic here
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Joi schema for validating user login data
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Dynamic validation middleware for user login data
const validateLoginData = validateData(loginSchema);

// Route to log in a user
router.post('/login', validateLoginData, async (req, res) => {
  try {
    // User login logic here
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
