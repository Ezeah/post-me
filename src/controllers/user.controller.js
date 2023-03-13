const User = require('../models/user.model');
const services = require('../services/user.service')
const joi = require('joi');
const constants = require('../utilities/constants.utilities');
const { USER, DATABASES } = constants;

class UserController {
  static async registerUser(req, res) {
    try {
      // Validate request body using Joi schema
      const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        handle: joi.string().required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }

      // Check if user with same email or username already exists
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      });
      if (existingUser) {
        return res.status(409).send({ message: 'User already exists' });
      }

      // Create new user
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        handle: req.body.handle,
        role: 'user',
      });
      await user.save();

      // Generate JWT token for the user
      const token = await user.generateAuthToken();
      return res.status(201).send({ user, token });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      // Validate request body using Joi schema
      const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details[0].message });
      }

      // Find user by email and check password
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    } catch (error) {
      return res.status(401).send({ message: error.message });
    }
  }

  static async logoutUser(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
      await req.user.save();
      return res.send({ message: 'User logged out successfully' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = UserController;
