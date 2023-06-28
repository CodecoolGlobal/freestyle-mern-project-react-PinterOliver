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
    /* const fullBooks = await Promise.all(books.map(async (book) => {
      const amount = await StoredItem.find({item: book._id});
      book.amount = amount;
      return book;
    })); */
    res.status(200).json({books: books});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one book
const getOneBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    /* const amount = await StoredItem.find({item: book._id});
    book.amount = amount; */
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(200).json({book: book});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//ADD one new book with ADMIN account
const addOneBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    const newStoredItem = await StoredItem.create({
      item: newBook._id,
      amount: 0,
    });
    res.status(201).json({book: newBook, storeditem: newStoredItem});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//DELETE a book with ADMIN account
const deleteOneBook = async (req, res) => {
  try {
    const { id } = req.params;
    const storedItem = await StoredItem.findOneAndDelete({item: id});
    if (!storedItem) {
      return res.status(404).json({error: 'No such stored item'});
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(202).json({book: book, storeditem: storedItem});
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
    }, {returnDocument: 'after'});
    if (!book) {
      return res.status(404).json({error: 'No such book'});
    }
    res.status(202).json({book: book});
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
