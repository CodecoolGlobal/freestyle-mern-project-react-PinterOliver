/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Book = require('../models/Book');
const StoredItem = require('../model/StoredItem.js');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({title: -1});
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one book
const getOneBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//ADD one new book with ADMIN account
const addOneBook = async (req, res) => {
  try {
    if (Book.findOne({title: req.body.title})) {
      return res.status(403).json({error: 'There is already a book with this title'});
    }
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  addOneBook,
};
