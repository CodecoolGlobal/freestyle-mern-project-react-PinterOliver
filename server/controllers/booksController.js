/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const Book = require('../model/Book');
const StoredItem = require('../model/StoredItem');

const {
  stringSearch,
  numberSearch,
  arraySearch,
  toSort,
} = require('./filterAndSort');

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const { title, author, maxprice, genres, sort } = req.query;
    let search = {};
    if (title) search = stringSearch(search, 'title', title);
    if (author) search = stringSearch(search, 'author', author);
    if (maxprice) {
      const numberMaxprice = Number(maxprice);
      search = numberSearch(search, 'price', numberMaxprice, 'lte');
    }
    if (genres) {
      const genresArray = genres.split(',');
      search = arraySearch(search, 'genres', genresArray);
    }
    let sortBy = {
      'title': 1,
    };
    if (sort) {
      const [type, ascend] = sort.split(',');
      sortBy = toSort(sortBy, type, ascend);
    }
    const books = await Book.find(search).sort(sortBy);
    const fullBooks = await Promise.all(books.map(async (book) => {
      const amount = await StoredItem.find({item: book._id});
      book.amount = amount;
      return book;
    }));
    res.status(200).json({books: fullBooks});
  } catch (error) {
    res.status(400).json({error: error});
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
    res.status(200).json({book: book});
  } catch (error) {
    res.status(400).json({error: error});
  }
};

//ADD one new book with ADMIN account
const addOneBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({book: newBook});
  } catch (error) {
    res.status(400).json({error: error});
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
    res.status(202).json({book: book});
  } catch (error) {
    res.status(400).json({error: error});
  }
};

//UPDATE one book
const updateOneBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOneAndUpdate({_id: id}, {
      ...req.body,
    }, {returnDocument: 'after'});
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(202).json({book: book});
  } catch (error) {
    res.status(400).json({error: error});
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  addOneBook,
  deleteOneBook,
  updateOneBook,
};
