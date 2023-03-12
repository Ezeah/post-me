const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

class UserService {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }
  async login(email, password) {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return { user, token };
  }
  async getAllUsers() {
    return User.find();
  }
  async getUserById(id) {
    return User.findById(id);
  }
  async updateUser(id, updates) {
    const allowedUpdates = ["username", "email", "password"];
    const isValidOperation = Object.keys(updates).every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    Object.keys(updates).forEach(update => (user[update] = updates[update]));
    await user.save();
    return user;
  }
  async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.isDeleted = true;
    await user.save();
    return user;
  }
  async getUserHandleById(id) {
    const user = await User.findById(id).select("handle");
    if (!user) {
      throw new Error("User not found");
    }
    return user.handle;
  }
  async getUserHandleAndPostsById(id) {
    const user = await User.findById(id).populate("posts");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = new UserService();
