const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    platforms: [{ type: String }],  // e.g., ['PC', 'PlayStation', 'Xbox']
    releaseDate: { type: Date },
    genre: { type: String },
    rating: { type: Number, min: 0, max: 10 },
    imageUrl: { type: String }
  });
  
  module.exports = mongoose.model('Game', GameSchema);