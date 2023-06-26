const express = require('express')

const {
    getAllBooks,
    getBook
} = require('../controllers/booksController')

const {
    login
} = require('../controllers/loginController')

const router = express.Router();



//LOGIN page
router.post('/login', login)

//GET all books
router.get('/books', getAllBooks)

//GET one book
router.get('/books/:id', getOneBook)

//Add new BOOK with ADMIN account
router.post('/books', addOneBook)

//DELETE a book with ADMIN account
router.delete('/books', deleteOneBook)

//UPDATE a book with ADMIN account
router.patch('/books/:id', updateOneBook)

//GET all orders
router.get('/orders', getAllOrders)

//GET one order
router.get('/orders/:id', getOneOrder)

//CREATE a new order
router.post('/orders', addOneOrder)

//DELETE one order
router.delete('/orders/:id', deleteOneOrder)

//UPDATE one order
router.patch('/orders/:id', updateOneOrder)

//GET all users with ADMIN account
router.get('/users', getAllUsers)

//GET one user
router.get('/users/:id', getOneUser)

//CREATE a new user (registration)
router.post('/users', addOneUser)

//DELETE one user
router.delete('/users/:id', deleteOneUser)

//UPDATE one user
router.patch('/users/:id', updateOneUser)


module.exports = router
