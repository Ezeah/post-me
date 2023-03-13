const commentService = require('../services/comment.service');

class CommentController {
  async createComment(req, res, next) {
    try {
      const { text, user, postit } = req.body;
      const comment = await commentService.createComment(text, user, postit);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async getCommentById(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await commentService.getCommentById(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const comment = await commentService.updateComment(id, updates);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await commentService.deleteComment(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
