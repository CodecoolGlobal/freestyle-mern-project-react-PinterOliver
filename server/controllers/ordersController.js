/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Book = require('../model/Book.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const StoredItem = require('../model/StoredItem.js');
const User = require('../model/User.js');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderHeader.find({}).sort({createdAt: -1});
    const orderItems = await OrderItem.find({});
    orders.forEach((order) => {
      order.items = orderItems.filter((item) => item.order === order._id);
      order.items.forEach(async (item) => {
        const book = await Book.findById(item.item);
        item.book = book;
      });
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one order
const getOneOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderHeader.findById(id);
    if (!order) {
      return res.status(404).json({error: 'No such order'});
    }
    const orderItems = await OrderItem.find({order: id});
    order.items = orderItems;
    order.items.forEach(async (item) => {
      const book = await Book.findById(item.item);
      item.book = book;
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//CREATE a new order
const addOneOrder = async (req, res) => {
  try {
    const orderItems = req.body;
    const order = {};
    const user = await User.findOne({token: req.header.token});
    order.user = user._id;
    const isExist = await OrderHeader.findOne({user: user._id});
    if (isExist) {
      return res.status(405).json({express: {success: false, rightMethod: 'PATCH'}});
    }
    order.state = 'cart';
    order.totalPrice = 0;
    let newOrder = await OrderHeader.create(order);
    let total = 0;
    const newOrderItems = [];
    orderItems.forEach(async (item) => {
      item.price = item.amount * item.book.price;
      total += item.price;
      item.order = newOrder._id;
      item.item = item.book._id;
      const orderItem = await OrderItem.create(item);
      newOrderItems.push(orderItem);
    });
    newOrder.totalPrice = total;
    newOrder = await newOrder.save();
    newOrder.items = newOrderItems;
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};


module.exports = {
  getAllOrders,
  getOneOrder,
  addOneOrder,
  deleteOneOrder,
  updateOneOrder,
};
