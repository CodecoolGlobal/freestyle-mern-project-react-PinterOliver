const Book = require('../models/Book')
const mongoose = require('mongoose')




////////////////////////////////////////////////

const Book = require('../model/Book.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const Role = require('../model/Role.js');
const StoredItem = require('../model/StoredItem.js');
const User = require('../model/User.js');
const express = require('express');
const router = express.Router();

console.log([Book, OrderHeader, OrderItem, Role, StoredItem, User]);

export default router;

// GET all books
const getAllBooks = async (req, res) => {
    const books = await Book.find({}).sort({title: -1})

    res.status(200).json(books)
}

// GET a single book
const getBook = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such book'})
    }

    const book = await Book.findById(id)

    if (!book) {
        return res.status(404).json({error: 'No such book'})
    }

    res.status(200).json(book)
}




module.exports = {
    getAllBooks,
    getBook
}