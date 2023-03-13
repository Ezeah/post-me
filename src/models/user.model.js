const express = require("express");
const mongoose = require("mongoose");
const joi = require('joi');
const validator = require("validator");
const adminAuth = require("../middlewares/adminAuth.middleware")
const userAuth = require("../middlewares/userAuth.middleware")
const userRouter =  require("../routes/user.route")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../utilities/constants.utilities");
const { string, array } = require("joi");
const { USER, DATABASES } = constants;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            const isValidUsername = validator.isUsername(value);
            if (!isValidUsername) {
                const errorMessage = "Username is invalid";
                throw new Error(errorMessage);
        }
    },
},
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error("Invalid email");
        }
    },
},
password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
        if (value.toLowerCase().includes("password")) {
            throw new Error("Password cannot contain 'password'");
        }
    },
},
handle: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
},
isDeleted: {
    type: Boolean,
    default: false,
},
role: {
    type: String,
    required: true,
    trim: true,
    enum: ["user", "admin"],
    default: "user",
},
tokens: [{
    token: {
        type: String,
        required: true,
    },},],
},
{ timestamps: true }
);

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "author",
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid login credentials");
    }
    return user;
};

// Hash plain text password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;