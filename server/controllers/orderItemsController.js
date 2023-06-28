/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const Book = require('../model/Book.js');
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const StoredItem = require('../model/StoredItem.js');

// GET all ordersItem
const getAllOrderItems = async (req, res) => {
  try {
    const search = req.search;
    const orders = await OrderItem.find(search).sort({createdAt: -1});
    res.status(200).json({orderitems: orders});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one orderItem
const getOneOrderItem = async (req, res) => {
  try {
    const search = req.search;
    const { id } = req.params;
    search._id = id;
    const order = await OrderHeader.findOne(search);
    if (!order) {
      return res.status(404).json({error: 'You don\'t have such order'});
    }
    const orderItems = await OrderItem.find({order: id});
    order.items = orderItems;
    order.items.forEach(async (item) => {
      const book = await Book.findById(item.item);
      item.book = book;
    });
    res.status(200).json({orderitem: order});
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

//CREATE a new orderItem
const addOneOrderItem = async (req, res) => {
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
    res.status(201).json({orderitem: newOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE a new orderItem
const updateOneOrderItem = async (req, res) => {
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
    res.status(202).json({orderitem: savedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an orderItem
const deleteOneOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderHeader.findByIdAndDelete(id);
    const deletedItems = await OrderItem.deleteMany({order: id});
    deletedOrder.items = deletedItems;
    res.status(202).json({orderitem: deletedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET Cart orderItem
const getCartOrderItem = async (req, res) => {
  try {
    const user = req.user;
    const order = await OrderHeader.findOne({user: user._id, state: 'cart'});
    if (!order) {
      return res.status(204).json({message: 'Cart is empty'});
    }
    const orderItems = await OrderItem.find({order: user._id});
    order.items = orderItems;
    order.items.forEach(async (item) => {
      const book = await Book.findById(item.item);
      item.book = book;
    });
    res.status(200).json({message: 'User has a cart', orderitem: order});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllOrderItems,
  getOneOrderItem,
  addOneOrderItem,
  deleteOneOrderItem,
  updateOneOrderItem,
  getCartOrderItem,
};
