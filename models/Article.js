const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: [{ type: String, required: true }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  publishedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  images: [{ type: String }],  // Mảng chứa URL của nhiều ảnh
  videos: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Article', ArticleSchema);
