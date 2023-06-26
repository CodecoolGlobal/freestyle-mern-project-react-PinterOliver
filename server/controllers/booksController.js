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

//ADD one new book with ADMIN account
const addOneBook = async (req, res) => {
    const id = req.header.token

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'User ID is not valid'});
        };
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({error: 'No such user'});
        };
        const role = await Role.findOne({name: user.role})
        if (!role.canModifyItems) {
            return res.status(401).json({error: "You have no right to access"})
        }
        if (Book.findOne({title: req.body.title})) {
            return res.status(403).json({error: "There is already a book with this title"})
        }
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    getAllBooks,
    getOneBook,
    addOneBook
}