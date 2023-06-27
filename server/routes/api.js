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
router.delete('/books/:id', idValidation, userValidation, bookAdminValidation, deleteOneBook);

//UPDATE a book with ADMIN account
// eslint-disable-next-line max-len
router.patch('/books/:id', idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

//GET all orders
router.get('/orders', userValidation, getAllOrders);

export default router;
