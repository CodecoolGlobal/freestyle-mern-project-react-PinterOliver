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
  userUserValidation,
} = require('../controllers/validation');

router.route('/login').post(login);


router.route('/books')
.get(getAllBooks)
.post(userValidation, bookAdminValidation, bookValidation, addOneBook);

router.route('/books/:id')
.get(idValidation, getOneBook)
.delete(idValidation, userValidation, bookAdminValidation, deleteOneBook)
.patch(idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

router.route('/orders')
.get(userValidation, orderAdminValidation, getAllOrders)
.post(userValidation, orderAdminValidation, addOneOrder);

router.route('/orders/cart')
.get(userValidation, orderAdminValidation, getCartOrder);

router.route('/orders/:id')
.get(idValidation, userValidation, orderAdminValidation, getOneOrder)
.delete(idValidation, userValidation, orderAdminValidation, orderValidation, deleteOneOrder)
.patch(idValidation, userValidation, orderAdminValidation, orderValidation, updateOneOrder);

router.route('/users')
.get(userValidation, userAdminValidation, getAllUsers)
.post(userDataValidation, addOneUser);

router.route('/users/:id')
.get(idValidation, userValidation, userAdminValidation, userUserValidation, getOneUser)
.delete(idValidation, userValidation, userAdminValidation, userUserValidation, deleteOneUser)
.patch(idValidation, userValidation, userDataValidation, userAdminValidation, userUserValidation, updateOneUser);

module.exports = router;


//LOGIN page
//router.post('/login', login);


//Add new BOOK with ADMIN account
//router.post('/books', userValidation, bookAdminValidation, bookValidation, addOneBook);
//router.get('/books', getAllBooks);

//DELETE a book with ADMIN account
//router.delete('/books/:id', idValidation, userValidation, bookAdminValidation, deleteOneBook);

//UPDATE a book with ADMIN account
// eslint-disable-next-line max-len
//router.patch('/books/:id', idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

//GET all orders
//router.get('/orders', userValidation, orderAdminValidation, getAllOrders);

//GET cart order

//GET one order
//router.get('/orders/:id', idValidation, userValidation, orderAdminValidation, getOneOrder);

//CREATE a new order
//router.post('/orders', userValidation, orderAdminValidation, addOneOrder);

//DELETE one order
// eslint-disable-next-line max-len
//router.delete('/orders/:id', idValidation, userValidation, orderAdminValidation, orderValidation, deleteOneOrder);

//UPDATE one order
// eslint-disable-next-line max-len
//router.patch('/orders/:id', idValidation, userValidation, orderAdminValidation, orderValidation, updateOneOrder);


//GET all users with ADMIN account
//router.get('/users', userValidation, userAdminValidation, getAllUsers);

//GET one user
// eslint-disable-next-line max-len
//router.get('/users/:id', idValidation, userValidation, userAdminValidation, userUserValidation, getOneUser);

//CREATE a new user (registration)
//router.post('/users', userDataValidation, addOneUser);

//DELETE one user
// eslint-disable-next-line max-len
//router.delete('/users/:id', idValidation, userValidation, userAdminValidation, userUserValidation, deleteOneUser);

//UPDATE one user
// eslint-disable-next-line max-len
//router.patch('/users/:id', idValidation, userValidation, userDataValidation, userAdminValidation, userUserValidation, updateOneUser);