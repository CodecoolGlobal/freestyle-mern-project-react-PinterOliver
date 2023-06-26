/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Book = require('../model/Book.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const StoredItem = require('../model/StoredItem.js');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderHeader.find({}).sort({createdAt: -1});
    const orderItems = await OrderItem.find({});
    orders.forEach((order) => {
      order.items = orderItems.filter((item) => item.order === order._id);
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
    res.status(200).json(order);
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
