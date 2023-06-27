/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const Book = require('../model/Book');
const StoredItem = require('../model/StoredItem');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({title: -1});
    const fullBooks = await Promise.all(books.map(async (book) => {
      const amount = await StoredItem.find({item: book._id});
      book.amount = amount;
    }));
    res.status(200).json({books: fullBooks});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one book
const getOneBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    const amount = await StoredItem.find({item: book._id});
    book.amount = amount;
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

//DELETE a book with ADMIN account
const deleteOneBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({_id: id});
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE one book
const updateOneBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOneAndUpdate({_id: id}, {
      ...req.body,
    });
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};


module.exports = {
  getAllBooks,
  getOneBook,
  addOneBook,
  deleteOneBook,
  updateOneBook,
};
