/* eslint-disable camelcase */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  publishedAt: Date,
  price: Number,
  genres: [String],
  description: String,
  image_url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Book', bookSchema);
