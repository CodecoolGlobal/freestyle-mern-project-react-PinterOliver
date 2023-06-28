/* eslint-disable max-len */
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
  getAllOrderHeaders,
  getOneOrderHeader,
  addOneOrderHeader,
  deleteOneOrderHeader,
  updateOneOrderHeader,
  getCartOrderHeader,
} = require('../controllers/orderHeadersController');

const {
  getAllOrderItems,
  getOneOrdersItems,
  getOneOrderItem,
  addOneOrderItem,
  deleteOneOrderItem,
  updateOneOrderItem,
} = require('../controllers/orderItemsController');

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
  orderHeaderValidation,
  orderItemValidation,
  bookValidation,
  userDataValidation,
  userIdValidation,
} = require('../controllers/validation');

router.route('/login').post(login);

router.route('/books')
  .get(getAllBooks)
  .post(userValidation, bookAdminValidation, bookValidation, addOneBook);

router.route('/books/:id')
  .get(idValidation, getOneBook)
  .delete(idValidation, userValidation, bookAdminValidation, deleteOneBook)
  .patch(idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

router.route('/orderheaders')
  .get(userValidation, orderAdminValidation, getAllOrderHeaders)
  .post(userValidation, orderAdminValidation, addOneOrderHeader);

router.route('/orderheaders/cart')
  .get(userValidation, orderAdminValidation, getCartOrderHeader);

router.route('/orderheaders/:id')
  .get(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, getOneOrderHeader)
  .delete(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, deleteOneOrderHeader)
  .patch(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, updateOneOrderHeader);

router.route('/orderitems/orderheaders/:id')
  .get(idValidation, userValidation, orderAdminValidation, getOneOrdersItems);

router.route('/orderitems')
  .get(userValidation, orderAdminValidation, getAllOrderItems)
  .post(userValidation, orderAdminValidation, addOneOrderItem);

router.route('/orderitems/:id')
  .get(idValidation, userValidation, orderAdminValidation, orderItemValidation, getOneOrderItem)
  .delete(idValidation, userValidation, orderAdminValidation, orderItemValidation, deleteOneOrderItem)
  .patch(idValidation, userValidation, orderAdminValidation, orderItemValidation, updateOneOrderItem);

router.route('/users')
  .get(userValidation, userAdminValidation, getAllUsers)
  .post(userDataValidation, addOneUser);

router.route('/users/:id')
  .get(idValidation, userValidation, userAdminValidation, userIdValidation, getOneUser)
  .delete(idValidation, userValidation, userAdminValidation, userIdValidation, deleteOneUser)
  .patch(idValidation, userValidation, userDataValidation, userAdminValidation, userIdValidation, updateOneUser);

module.exports = router;
