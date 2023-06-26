const mongoose = require('mongoose');
const Book = require('../models/Book');
const Role = require('../model/Role.js');
const User = require('../model/User.js');
const StoredItem = require('../model/StoredItem.js');


// GET all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({}).sort({title: -1})
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

// GET one book
const getOneBook = async (req, res) => {
    const { id } = req.params

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'Book ID is not valid'});
        };
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({error: 'No such book'});
        };
        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}




module.exports = {
    getAllBooks,
    getOneBook
}