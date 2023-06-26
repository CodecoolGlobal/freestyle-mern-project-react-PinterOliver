const express = require('express');

const {
  login,
} = require('../controllers/loginController');

const {
  getAllBooks,
  getOneBook,
  addOneBook,
  deleteOneBook,
  updateOneBook,
} = require('../controllers/booksController');

const {
  getAllOrders,
  getOneOrder,
  addOneOrder,
  deleteOneOrder,
  updateOneOrder,
} = require('../controllers/ordersController');

const {
  getAllUsers,
  getOneUser,
  addOneUser,
  deleteOneUser,
  updateOneUser,
} = require('../controllers/usersController');

const router = express.Router();

const {
  idValidation,
  userValidation,
} = require('../controllers/auxiliary');


//LOGIN page
router.post('/login', login);

//GET all books
router.get('/books', getAllBooks);

//GET one book
router.get('/books/:id', idValidation, getOneBook);

//Add new BOOK with ADMIN account
router.post('/books', userValidation, addOneBook);

//DELETE a book with ADMIN account
router.delete('/books', idValidation, deleteOneBook);

//UPDATE a book with ADMIN account
router.patch('/books/:id', idValidation, userValidation, updateOneBook);

//GET all orders
router.get('/orders', getAllOrders);

//GET one order
router.get('/orders/:id', idValidation, getOneOrder);

//CREATE a new order
router.post('/orders', addOneOrder);

//DELETE one order
router.delete('/orders/:id', idValidation, deleteOneOrder);

//UPDATE one order
router.patch('/orders/:id', idValidation, updateOneOrder);

//GET all users with ADMIN account
router.get('/users', idValidation, userValidation, getAllUsers);

//GET one user
router.get('/users/:id', idValidation, getOneUser);

//CREATE a new user (registration)
router.post('/users', addOneUser);

//DELETE one user
router.delete('/users/:id', idValidation, deleteOneUser);

//UPDATE one user
router.patch('/users/:id', idValidation, updateOneUser);


module.exports = router;
