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
  bookAdminValidation,
  userAdminValidation,
  userOrderValidation,
  bookValidation,
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
router.delete('/books', idValidation, userValidation, bookAdminValidation, deleteOneBook);

//UPDATE a book with ADMIN account
// eslint-disable-next-line max-len
router.patch('/books/:id', idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

//GET all orders
router.get('/orders', userValidation, getAllOrders);

//GET one order
router.get('/orders/:id', idValidation, userValidation, getOneOrder);

//CREATE a new order
router.post('/orders', userValidation, addOneOrder);

//DELETE one order
router.delete('/orders/:id', idValidation, userValidation, userOrderValidation, deleteOneOrder);

//UPDATE one order
router.patch('/orders/:id', idValidation, userValidation, userOrderValidation, updateOneOrder);

//GET all users with ADMIN account
router.get('/users', idValidation, userValidation, userAdminValidation, getAllUsers);

//GET one user
router.get('/users/:id', idValidation, userValidation, getOneUser);

//CREATE a new user (registration)
router.post('/users', addOneUser);

//DELETE one user
router.delete('/users/:id', idValidation, userValidation, deleteOneUser);

//UPDATE one user
router.patch('/users/:id', idValidation, userValidation, updateOneUser);


module.exports = router;
