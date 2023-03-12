const express = require('express');
const Joi = require('joi');
const validate = require('../middlewares/validate.middleware');
const userauth = require('../middlewares/userauth.middleware');
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
