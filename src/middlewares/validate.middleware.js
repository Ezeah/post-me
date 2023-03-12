const express = require('express');
const Joi = require('joi');
const Validate = require('../middlewares/adminauth.middleware');
const Authenticate = require('../middlewares/userauth.middleware');
const post = require('../models/post.model');
const comment = require('../models/comment.model');
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
