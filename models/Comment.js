const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Comment', CommentSchema);