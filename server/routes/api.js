/* eslint-disable max-len */
const express = require('express');

const { login, checkToken, logout } = require('../controllers/loginController');

const {
  getAllBooks,
  getOneBook,
  addOneBook,
  deleteOneBook,
  updateOneBook,
} = require('../controllers/booksController');

const {
  getAllStoredItems,
  getOneStoredItem,
  updateOneStoredItem,
} = require('../controllers/storedItemsController');

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
  getOneUserbyEmail,
  resetSecurityCode,
  changePassword,
  deleteSecurityNumber,
} = require('../controllers/usersController');

const {
  getAllRoles,
  getOneRole,
  addOneRole,
  deleteOneRole,
  updateOneRole,
} = require('../controllers/rolesController');

const {
  sendCreateUserEmail,
  sendChangeOrderStateEmail,
  sendCompleteOrderEmail,
  sendPasswordResetEmail,
} = require('../controllers/emailController');

const { getOwnMessages, postMessage } = require('../controllers/chatController');

const router = express.Router();

const {
  idValidation,
  userValidation,
  bookAdminValidation,
  storedItemAdminValidation,
  orderAdminValidation,
  userAdminValidation,
  roleAdminValidation,
  orderHeaderValidation,
  orderItemValidation,
  bookValidation,
  storedItemValidation,
  userDataValidation,
  userIdValidation,
  roleDataValidation,
} = require('../controllers/validation');

router.route('/login')
  .get(userValidation, checkToken)
  .post(login)
  .delete(userValidation, logout);

router.route('/books')
  .get(getAllBooks)
  .post(userValidation, bookAdminValidation, bookValidation, addOneBook);

router.route('/books/:id')
  .get(idValidation, getOneBook)
  .delete(idValidation, userValidation, bookAdminValidation, deleteOneBook)
  .patch(idValidation, userValidation, bookAdminValidation, bookValidation, updateOneBook);

router.route('/storeditems')
  .get(getAllStoredItems);

router.route('/storeditems/books/:id')
  .get(idValidation, storedItemValidation, getOneStoredItem)
  .patch(
    idValidation,
    userValidation,
    storedItemAdminValidation,
    storedItemValidation,
    updateOneStoredItem,
  );

router.route('/orderheaders')
  .get(userValidation, orderAdminValidation, getAllOrderHeaders)
  .post(userValidation, orderAdminValidation, addOneOrderHeader);

router.route('/orderheaders/cart')
  .get(userValidation, getCartOrderHeader);

router.route('/orderheaders/:id')
  .get(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, getOneOrderHeader)
  .delete(
    idValidation,
    userValidation,
    orderAdminValidation,
    orderHeaderValidation,
    deleteOneOrderHeader,
  )
  .patch(
    idValidation,
    userValidation,
    orderAdminValidation,
    orderHeaderValidation,
    updateOneOrderHeader,
  );

router.route('/orderitems/orderheaders/:id')
  .get(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, getOneOrdersItems)
  .post(idValidation, userValidation, orderAdminValidation, orderHeaderValidation, addOneOrderItem);

router.route('/orderitems')
  .get(userValidation, orderAdminValidation, getAllOrderItems);

router.route('/orderitems/:id')
  .get(idValidation, userValidation, orderAdminValidation, orderItemValidation, getOneOrderItem)
  .delete(
    idValidation,
    userValidation,
    orderAdminValidation,
    orderItemValidation,
    deleteOneOrderItem,
  )
  .patch(
    idValidation,
    userValidation,
    orderAdminValidation,
    orderItemValidation,
    updateOneOrderItem,
  );

router.route('/users')
  .get(userValidation, userAdminValidation, getAllUsers)
  .post(userDataValidation, sendCreateUserEmail, addOneUser);

router.route('/users/:id')
  .get(idValidation, userValidation, userAdminValidation, userIdValidation, getOneUser)
  .delete(idValidation, userValidation, userAdminValidation, userIdValidation, deleteOneUser)
  .patch(
    idValidation,
    userValidation,
    userDataValidation,
    userAdminValidation,
    userIdValidation,
    updateOneUser,
  );

router.route('/users/email/:email')
  .get(getOneUserbyEmail);

router.route('/users/reset/:id')
  .put(resetSecurityCode, sendPasswordResetEmail);

router.route('/users/changepassword')
  .put(changePassword)
  .delete(deleteSecurityNumber);

router.route('/roles')
  .get(userValidation, roleAdminValidation, getAllRoles)
  .post(roleDataValidation, addOneRole);

router.route('/roles/:id')
  .get(idValidation, userValidation, roleAdminValidation, getOneRole)
  .delete(idValidation, userValidation, roleAdminValidation, deleteOneRole)
  .patch(idValidation, userValidation, userDataValidation, userAdminValidation, updateOneRole);

router.route('/chat')
  .get(userValidation, getOwnMessages)
  .post(userValidation, postMessage);

module.exports = router;
