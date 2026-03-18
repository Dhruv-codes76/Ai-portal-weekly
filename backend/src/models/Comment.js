const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  article_id: { type: String, required: true, index: true },
  anonymous_id: { type: String, required: true },
  comment_text: { type: String, required: true },
  parent_id: { type: String, default: null, index: true },
  likes: { type: Number, default: 0, index: -1 },
  is_hidden: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Comment', commentSchema);
