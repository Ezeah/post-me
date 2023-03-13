const Comment = require('./commentModel');

async function createComment(text, user, postit) {
  const comment = new Comment({ text, user, postit, });
   await comment.save();
  return comment;
}
async function getCommentById(id) {
  const comment = await Comment.findById(id).populate('user').populate('postit');
  return comment;
}
async function updateComment(id, updates) {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new Error('Comment not found');
}
if (updates.text) {
    comment.text = updates.text;
  }
  if (updates.deleted) {
    comment.deleted = updates.deleted;
    comment.deletedAt = Date.now();
  }
  comment.updatedAt = Date.now();
  await comment.save();
  return comment;
}
async function deleteComment(id) {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new Error('Comment not found');
    }
comment.deleted = true;
comment.deletedAt = Date.now();
await comment.save();
return comment;
}

module.exports = {createComment,getCommentById,updateComment,deleteComment,};
