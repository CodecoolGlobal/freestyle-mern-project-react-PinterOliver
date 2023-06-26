/* eslint-disable camelcase */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String [required],
  author: String [required],
  publishedAt: Date [required],
  price: Number [required],
  genres: [String] [required],
  description: String [required],
  image_url: String [required],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Book', bookSchema);
