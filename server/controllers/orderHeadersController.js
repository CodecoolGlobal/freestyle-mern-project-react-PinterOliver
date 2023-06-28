/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const StoredItem = require('../model/StoredItem.js');
const { arraySearch } = require('./filterAndSort.js');

// GET all orderHeaders
const getAllOrderHeaders = async (req, res) => {
  try {
    const { state } = req.query;
    let search = req.search;
    if (state) {
      const stateArray = state.split(',');
      search = arraySearch(search, 'state', stateArray);
    }
    const orders = await OrderHeader.find(search).sort({createdAt: -1});
    res.status(200).json({orderheaders: orders});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one orderHeader
const getOneOrderHeader = (req, res) => {
  try {
    const order = req.order;
    res.status(200).json({orderheader: order});
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
    await storedItem.save();
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
  const deletedOrderItems = await Promise.all(
    newOrderItems.filter((newOrder) => !newOrder.amount).map(async (item) => {
      return await OrderItem.findByIdAndDelete(item._id);
    }));
  return {newOrderItems: newOrderItems, total: total, deletedOrderItems: deletedOrderItems};
};

//CREATE a new orderHeader
const addOneOrderHeader = async (req, res) => {
  try {
    const order = {};
    order.user = req.user._id;
    order.state = 'cart';
    order.totalPrice = 0;
    const newOrder = await OrderHeader.create(order);
    res.status(201).json({orderheader: newOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE an orderHeader
const updateOneOrderHeader = async (req, res) => {
  try {
    const orderItems = req.body.items;
    const order = req.order;
    let newState = req.body.newState;
    if (!newState) newState = order.state;
    let newOrderItems;
    let deletedOrderItems;
    if (orderItems) {
      const responseItem =
        await orderProcessing(orderItems, order, newState);
      order.totalPrice = responseItem.total;
      newOrderItems = responseItem.newOrderItems;
      deletedOrderItems = responseItem.deletedOrderItems;
    }
    if (newState) order.state = newState;
    const savedOrder = await order.save();
    if (orderItems) {
      savedOrder.items = newOrderItems;
    }
    savedOrder.deletedOrderItems = deletedOrderItems;
    res.status(202).json({orderheader: savedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an orderHeader
const deleteOneOrderHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItems = await OrderItem.deleteMany({order: id});
    const deletedOrder = await OrderHeader.findByIdAndDelete(id);
    deletedOrder.items = deletedItems;
    res.status(202).json({orderheader: deletedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET Cart orderHeader
const getCartOrderHeader = async (req, res) => {
  try {
    const user = req.user;
    const order = await OrderHeader.findOne({user: user._id, state: 'cart'});
    if (!order) {
      return res.status(204).json({orderheader: order, message: 'Cart is empty'});
    }
    res.status(200).json({message: 'User has a cart', orderheader: order});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllOrderHeaders,
  getOneOrderHeader,
  addOneOrderHeader,
  deleteOneOrderHeader,
  updateOneOrderHeader,
  getCartOrderHeader,
};
