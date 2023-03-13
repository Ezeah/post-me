const services = require('../services/post.service');

const postController = {
    async createPost(req, res) {
      try {
        const { title, content } = req.body;
        const authorId = req.user.id; // assuming you have an authentication middleware that sets req.user to the authenticated user
        const post = await createPost(title, content, authorId);
        res.status(201).json(post);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  
    async getPostById(req, res) {
      try {
        const postId = req.params.postId;
        const post = await getPostById(postId);
        res.json(post);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    },
  
    async updatePost(req, res) {
      try {
        const postId = req.params.postId;
        const update = req.body;
        const post = await updatePost(postId, update);
        res.json(post);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    },
  
    async deletePost(req, res) {
      try {
        const postId = req.params.postId;
        await deletePost(postId);
        res.sendStatus(204);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    },
  
    async createReply(req, res) {
      try {
        const { content } = req.body;
        const authorId = req.user.id; // assuming you have an authentication middleware that sets req.user to the authenticated user
        const postId = req.params.postId;
        const parentPostId = req.query.parentPostId || null; // assuming the parentPostId is passed as a query parameter
        const reply = await createReply(content, authorId, postId, parentPostId);
        res.status(201).json(reply);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    },
  
    async getRepliesByPostId(req, res) {
      try {
        const postId = req.params.postId;
        const replies = await getRepliesByPostId(postId);
        res.json(replies);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    },
  
    async deleteReply(req, res) {
      try {
        const replyId = req.params.replyId;
        await deleteReply(replyId);
        res.sendStatus(204);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    }
  };
  
  module.exports = postController;
  