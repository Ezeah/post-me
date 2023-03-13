const { PostIt, Reply } = require('../models/post.model');

// Function to create a new post
async function createPost(title, content, authorId) {
  const post = new PostIt({
    title,
    content,
    author: authorId
  });
  await post.save();
  return post;
}

// Function to retrieve a post by ID
async function getPostById(postId) {
  const post = await PostIt.findById(postId).populate('author', 'username');
  if (!post || post.isDeleted) {
    throw new Error('Post not found');
  }
  return post;
}

// Function to update a post by ID
async function updatePost(postId, update) {
  const post = await getPostById(postId);
  if (update.title) {
    post.title = update.title;
  }
  if (update.content) {
    post.content = update.content;
  }
  post.updatedAt = Date.now();
  await post.save();
  return post;
}

// Function to delete a post by ID
async function deletePost(postId) {
  const post = await getPostById(postId);
  post.isDeleted = true;
  await post.save();
}

// Function to create a new reply to a post
async function createReply(content, authorId, postId, parentPostId) {
  const reply = new Reply({
    content,
    author: authorId,
    postIt: postId,
    parentPost: parentPostId
  });
  await reply.save();
  return reply;
}

// Function to retrieve all replies to a post
async function getRepliesByPostId(postId) {
  const replies = await Reply.find({ postIt: postId, isDeleted: false }).populate('author', 'username');
  return replies;
}

// Function to delete a reply by ID
async function deleteReply(replyId) {
  const reply = await Reply.findById(replyId);
  reply.isDeleted = true;
  await reply.save();
}

module.exports = {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  createReply,
  getRepliesByPostId,
  deleteReply
};
