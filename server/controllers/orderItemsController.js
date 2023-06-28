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

// GET one ordersItems
const getOneOrdersItems = async (req, res) => {
  try {
    const search = req.search;
    const { id } = req.params;
    search._id = id;
    const orderHeader = await OrderHeader.findOne(search);
    if (!orderHeader) {
      return res.status(404).json({error: 'No such order exits'});
    }
    const orderItems = await OrderItem.find({order: id}).populate({path: 'item', model: Book});
    res.status(200).json({orderitems: orderItems});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one orderItem
const getOneOrderItem = (req, res) => {
  try {
    const order = req.order;
    res.status(200).json({orderitem: order});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// Help to process orders
const restate = async (orderHeader) => {
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

const putBack = async (order) => {
  
};

//CREATE a new orderItem
const addOneOrderItem = async (req, res) => {
  try {
    const orderHeader = req.order;
    const {bookid, amount} = req.body;
    const book = await Book.findById(bookid);
    const order = {};
    order.order = orderHeader._id;
    order.item = book._id;
    order.bookPrice = book.price;
    if (orderHeader.state !== 'cart') {
      pullFrom(bookid, amount);
    }
    order.amount = amount;
    order.price = order.amount * order.bookPrice;
    const newOrder = await OrderItem.create(order);
    restate(orderHeader);
    res.status(201).json({orderitem: newOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE an orderItem
const updateOneOrderItem = async (req, res) => {
  try {
    const order = req.order;
    const amount = req.body.amount;
    if (typeof amount !== 'number') {
      return res.status(400).json({error: 'Amount is not defined'});
    }
    if (!amount) {
      return res.status(405).json({error: 'Amount cannot be zero', rightMethod: 'DELETE'});
    }
    order.amount = amount;
    const savedOrder = await order.save();
    const orderHeader = order.order;
    restate(orderHeader);
    res.status(202).json({orderitem: savedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an orderItem
const deleteOneOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const orderHeader = req.order.order;
    const deletedOrder = await OrderItem.findByIdAndDelete(id);
    restate(orderHeader);
    res.status(202).json({orderitem: deletedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllOrderItems,
  getOneOrdersItems,
  getOneOrderItem,
  addOneOrderItem,
  deleteOneOrderItem,
  updateOneOrderItem,
};
