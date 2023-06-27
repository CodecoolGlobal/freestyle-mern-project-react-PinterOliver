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
  getCartOrder,
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
  bookAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  orderValidation,
  bookValidation,
  userDataValidation,
} = require('../controllers/validation');

//LOGIN page
router.post('/login', login);

//GET all books
router.get('/books', getAllBooks);

//GET one book
router.get('/books/:id', idValidation, getOneBook);

//Add new BOOK with ADMIN account
router.post('/books', userValidation, bookAdminValidation, bookValidation, addOneBook);

//DELETE a book with ADMIN account
router.delete('/books/:id', idValidation, userValidation, bookAdminValidation, deleteOneBook);

//UPDATE a book with ADMIN account
// eslint-disable-next-line max-len
router.patch('/books/:id', idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

//GET all orders
router.get('/orders', userValidation, orderAdminValidation, getAllOrders);

//GET cart order
router.get('/orders/cart', userValidation, orderAdminValidation, getCartOrder);

//GET one order
router.get('/orders/:id', idValidation, userValidation, orderAdminValidation, getOneOrder);

//CREATE a new order
router.post('/orders', userValidation, orderAdminValidation, addOneOrder);

//DELETE one order
// eslint-disable-next-line max-len
router.delete('/orders/:id', idValidation, userValidation, orderAdminValidation, orderValidation, deleteOneOrder);

//UPDATE one order
// eslint-disable-next-line max-len
router.patch('/orders/:id', idValidation, userValidation, orderAdminValidation, orderValidation, updateOneOrder);

//GET all users with ADMIN account
router.get('/users', userValidation, userAdminValidation, getAllUsers);

//GET one user
router.get('/users/:id', idValidation, userValidation, getOneUser);

//CREATE a new user (registration)
router.post('/users', userDataValidation, addOneUser);

//DELETE one user
router.delete('/users/:id', idValidation, userValidation, deleteOneUser);

//UPDATE one user
router.patch('/users/:id', idValidation, userValidation, userDataValidation, updateOneUser);

module.exports = router;
