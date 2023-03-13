const express = require('express');
const router = express.Router();
const joi = require('joi');
const user = require('../models/user.model');
const post = require('../models/post.model');
const comment = require('../models/comment.model');
const userAuth = require('../middlewares/userauth.middleware');
const validate = require('../middlewares/validate.middleware');

//  Create a comment under the postit with the given postit id
router.post('/:postitId/comments', [validate, [check('text', 'Comment text is required').notEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const postit = await Postit.findById(req.params.postitId);
        if (!postit) {
            return res.status(404).json({ msg: 'Postit not found' });
        }
        const comment = new Comment({
            text: req.body.text,
            user: req.user.id,
            postit: req.params.postitId
        });
        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a comment by id
router.get("/comments/:id", validate, async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(200).json(comment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });


// Get a single comment with the given comment id under the post with the given post id
router.get('/:postitId/comments/:commentId', async (req, res) => {
    try {
        const postit = await Postit.findById(req.params.postitId);
        if (!postit) {
            return res.status(404).json({ msg: 'Postit not found' });
        }
        const comment = await Comment.findById(req.params.commentId).populate('user', ['name']);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get comments under the post with the given post id

router.get('/:postitId/comments', async (req, res) => {
    try {
        const postit = await Postit.findById(req.params.postitId);
        if (!postit) {
            return res.status(404).json({ msg: 'Postit not found' });
        }
        const comments = await Comment.find({ postit: req.params.postitId }).populate('user', ['name']);
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a single comment with the comment id
router.patch('/:commentId', userAuth, getCommentById, (req, res) => {
  const comment = req.comment;
  comment.content = req.body.content;
  comment.save((err, updatedComment) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Comment updated successfully', comment: updatedComment });
  });
});

// Soft delete a comment that can only be deleted by its author
router.delete('/:commentId', userAuth, getCommentById, (req, res) => {
  const comment = req.comment;
  if (comment.author._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'You are not authorized to delete this comment' });
  }
  comment.deleted = true;
  comment.deletedAt = Date.now();
  comment.save((err, deletedComment) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Comment deleted successfully', comment: deletedComment });
  });
});

module.exports = router;










