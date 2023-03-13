const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require("./routes/user.route"); 
const database = require('./config/database.config');
const bodyParser = require('body-parser');
dotenv.config();
const constants = require("./utilities/constants.utilities");
const { MESSAGES } = constants;
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan('common'));
app.use(userRouter);
app.use(express.json());
database();

// Initialize an object to hold our post
let postits = {};
let postitIdCounter = 0;

// Create a new user
app.post("api/v1/users", async (req, res) => {
  try {
    const user = new user(req.body);
    await user.save();
    res.status(201).json({ message: MESSAGES.POST, success: true, data });
  } catch (error) {
    console.error(error);
    res.status(501).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Get all users
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await users.find();
    res.status(200).json({ message: MESSAGES.GET, success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Get a single user by id
app.get("api/v1/users/:id", async (req, res) => {
  try {
    const user = await user.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ message: MESSAGES.GET, success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Update or replace a user
app.put("api/v1/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update));
    if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await user.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(201).send({ message: MESSAGES.PUT, success: true, data });
  } catch (err) {
    res.status(501).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Delete a user
app.delete("api/v1/users/:id", async (req, res) => {
  try {
    const user = await user.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    user.isDeleted = true;
    await user.save();
    res.status(200).send({ message: MESSAGES.DELETE, success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Get a user's handle by id
app.get("ap1/v1/users/:id/handle", async (req, res) => {
  try {
    const user = await user.findById(req.params.id).select("handle");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).send({ message: MESSAGES.GET, success: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Get a user's handle and posts by id
app.get("api/v1/users/:id/handle/posts", async (req, res) => {
  try {
    const user = await user.findById(req.params.id).populate("posts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).send({ message: MESSAGES.GET, success: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
});

// Endpoint to create a new post
app.post('api/v1/posts', (req, res) => {
  const postit = {
    id: ++postitIdCounter,
    author: req.body.author,
    content: req.body.content,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    replies: []
  };
  postits.push(postit);
  res.status(201).json({ message: MESSAGES.POST, success: true, data });
 (error) =>  {
if (error) { 
  res.status(501).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
}
});

// Endpoint to get all posts
app.get('api/v1/posts', (req, res) => {
  const sortedPostits = postits
    .filter(postit => !postit.deletedAt)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.status(200).json({ message: MESSAGES.GET, success: true, data });
  (error) =>  {
 if (error) { 
   res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
   }
 }
});

// Endpoint to get a post by ID
app.get('apiv1/posts/:id', (req, res) => {
  const postit = postits.find(postit => postit.id === Number(req.params.id));
  if (!postit || postit.deletedAt) {
    res.status(404).json({ message: 'Post is not found' });
    return;
  }
  res.status(200).json({ message: MESSAGES.GET, success: true, data });
});

// Endpoint to update a post by ID
app.put('api/v1/posts/:id', (req, res) => {
  let postit = postits.find(postit => postit.id === Number(req.params.id));
  if (!postit || postit.deletedAt) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  if (postit.author !== req.body.author) {
    res.status(403).json({ message: 'You are not authorized to update this post' });
    return;
  }
  postit.content = req.body.content;
  postit.updatedAt = new Date();
  res.json(postit);
});

// Endpoint to delete a post by ID
app.delete('api/v1/posts/:id', (req, res) => {
  let postit = postits.find(postit => postit.id === Number(req.params.id));
  if (!postit || postit.deletedAt) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  if (postit.author !== req.body.author) {
    res.status(403).json({ message: 'You are not authorized to delete this post' });
    return;
  }
  postit.deletedAt = new Date();
  res.json({ message: 'Post deleted successfully' });
});

// Endpoint to create a reply to a post
app.post('api/v1/posts/:id/replies', (req, res) => {
  let postit = postits.find(postit => postit.id === Number(req.params.id));
  if (!postit || postit.deletedAt) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  const reply = {
    id: ++postitIdCounter,
    author: req.body.author,
    content: req.body.content,
    createdAt: new Date(),
    deletedAt: null
  };
  postit.replies.push(reply);
  res.status(201).json.json({ message: MESSAGES.POST, success: true, data });
});

// Endpoint to delete a reply to a post by ID
app.delete('api/v1/posts/:id/replies/:replyId', (req, res) => {
  let postit = postits.find(postit => postit.id === Number(req.params.id));
  if (!postit || postit.deletedAt) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  let reply = postit.replies.find(reply => reply.id === Number(req.params.replyId));
  if (!reply || reply.deletedAt) {
    res.status(500).send({ message: err.message || MESSAGES.ERROR, success: false });
  }
  });

  // This endpoint deletes a user's own reply but not the reply of another
app.delete('api/v1/post/reply/:replyId', (req, res) => {
  const replyId = req.params.replyId;
  const userId = req.user.id; // assuming authentication middleware has been used to extract user information
  const reply = findReplyById(replyId);
  if (!reply) {
    return res.status(404).json({ message: 'Reply not found' });
  }
  if (reply.userId !== userId) {
    return res.status(403).json({ message: 'You are not authorized to delete this reply' });
  }
  reply.isDeleted = true; // soft delete the reply
  return res.send({ message: 'Reply deleted successfully'});
});

// This endpoint returns posts sorted by newest first
app.get('api/v1/posts', (req, res) => {
  const postIts = getAllPostIts();
  postIts.sort((a, b) => b.createdAt - a.createdAt); // sort post-its by createdAt date in descending order
  const filteredPostIts = postIts.filter(postIt => !postIt.isDeleted); // remove deleted post-its
  return res.json({ postIts: filteredPostIts });
});

app.listen(8000,()=>{
    console.log('server is up and running...')
})