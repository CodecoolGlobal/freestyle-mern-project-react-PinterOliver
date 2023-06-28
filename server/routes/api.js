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

const {
  getAllRoles,
  getOneRole
} = require('../controllers/rolesController');

const router = express.Router();

const {
  idValidation,
  userValidation,
  bookAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  roleAdminValidation,
  orderValidation,
  bookValidation,
  userDataValidation,
  userIdValidation,
  roleDataValidation,
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
  .get(idValidation, userValidation, userAdminValidation, userIdValidation, getOneUser)
  .delete(idValidation, userValidation, userAdminValidation, userIdValidation, deleteOneUser)
  .patch(idValidation, userValidation, userDataValidation, userAdminValidation, userIdValidation, updateOneUser);

router.route('/roles')
  .get(userValidation, roleAdminValidation, getAllRoles)
  .post(roleDataValidation, addOneRole);

router.route('/roles/:id')
  .get(idValidation, userValidation, roleAdminValidation, getOneRole)
//   .delete(idValidation, userValidation, roleAdminValidation, deleteOneUser)
//   .patch(idValidation, userValidation, userDataValidation, userAdminValidation, updateOneUser);

module.exports = router;
