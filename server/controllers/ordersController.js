/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
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

// Help to process CREATE and UPDATE orders
const orderProcessing = async (orderItems, order, newState) => {
  let total = 0;
  let canPriceChange = false;
  if (order.state === 'cart') canPriceChange = true;
  let oldItems = [];
  if (order.state !== 'cart') {
    const oldOrderItems = await OrderItem.find({order: order._id});
    oldItems = await Promise.all(oldOrderItems.map(async (oldOrder) => {
      const storedItem = await StoredItem.findOne({item: oldOrder.item});
      storedItem.amount += oldOrder.amount;
      return await storedItem.save();
    }));
  }
  const newOrderItems = await Promise.all(orderItems.map(async (item) => {
    const storedItem = await StoredItem.findOne({item: item.book._id});
    if (newState !== 'cart') {
      if (storedItem.amount < item.amount) {
        item.amount = storedItem.amount;
        console.log('Not enough books');
      }
      storedItem.amount -= item.amount;
    }
    storedItem.save();
    const isExist = oldItems.find((oldItem) => oldItem.item === item.book._id);
    if (canPriceChange || !isExist || item.amount > isExist.amount) {
      item.bookPrice = item.book.price;
    }
    item.price = item.amount * item.bookPrice;
    total += item.price;
    item.order = order._id;
    item.item = item.book._id;
    const orderedItem = await OrderItem.findOne({order: order._id, item: item.book._id});
    let orderItem;
    if (orderedItem) {
      orderedItem.amount = item.amount;
      orderedItem.price = item.price;
      orderItem = await orderedItem.save();
    } else {
      orderItem = await OrderItem.create(item);
    }
    return orderItem;
  }));
  return {newOrderItems: newOrderItems, total: total};
};

//CREATE a new order
const addOneOrder = async (req, res) => {
  try {
    const orderItems = req.body.items;
    const order = {};
    order.user = req.user._id;
    order.state = 'cart';
    order.totalPrice = 0;
    let newOrder = await OrderHeader.create(order);
    const {newOrderItems, total} =
      await orderProcessing(orderItems, newOrder, order.state);
    newOrder.totalPrice = total;
    newOrder = await newOrder.save();
    newOrder.items = newOrderItems;
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE a new order
const updateOneOrder = async (req, res) => {
  try {
    const orderItems = req.body.items;
    const order = req.order;
    let newState = req.body.newState;
    if (!newState) newState = order.state;
    let newOrderItems = [];
    if (orderItems) {
      const responseItem =
        await orderProcessing(orderItems, order, newState);
      order.totalPrice = responseItem.total;
      newOrderItems = responseItem.newOrderItems;
    }
    if (newState) order.state = newState;
    const savedOrder = await order.save();
    if (orderItems) {
      savedOrder.items = newOrderItems;
    }
    res.status(202).json(savedOrder);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an order
const deleteOneOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderHeader.findByIdAndDelete(id);
    const deletedItems = await OrderItem.deleteMany({order: id});
    deletedOrder.items = deletedItems;
    res.status(202).json(deletedOrder);
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
