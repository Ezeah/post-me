const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const constants = require("../utilities/constants.utilities");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      role: constants.USER.ROLE.ADMIN,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.admin = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized access" });
  }
};

module.exports = adminAuth;
