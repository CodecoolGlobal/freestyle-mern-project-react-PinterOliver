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

// Calculate totalcost of order
const updateHeader = async (orderHeader) => {
  const items = await OrderItem.find({order: orderHeader._id});
  const totalPrice = items.reduce((total, item) => total + item.price, 0);
  orderHeader.totalPrice = totalPrice;
  const newHeader = await orderHeader.save();
  return newHeader;
};

// Put back books to shelves
const putBack = async (bookid, amount) => {
  const item = await StoredItem.findOne({item: bookid});
  if (!item) {
    return {success: false, problem: 'StoredItem not found'};
  }
  item.amount += amount;
  await item.save();
  return {success: true};
};

// Pull books from shelves
const pullFrom = async (bookid, amount) => {
  const item = await StoredItem.findOne({item: bookid});
  if (!item) {
    return {success: false, problem: 'StoredItem not found'};
  }
  const response = {success: true};
  if (item.amount < amount) {
    response.problem = 'Not enough books';
    amount = item.amount;
  }
  item.amount -= amount;
  await item.save();
  response.amount = amount;
  return response;
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
    let problem = 'No problem.';
    if (orderHeader.state !== 'cart') {
      const resData = await pullFrom(bookid, amount);
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
      if (resData.problem) {
        problem = resData.problem;
      }
      order.amount = resData.amount;
    } else order.amount = amount;
    order.price = order.amount * order.bookPrice;
    const newOrder = await OrderItem.create(order);
    const newHeader = await updateHeader(orderHeader);
    res.status(201).json({orderitem: newOrder, message: problem, orderheader: newHeader});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE an orderItem
const updateOneOrderItem = async (req, res) => {
  try {
    const order = req.order;
    let amount = req.body.amount;
    if (typeof amount !== 'number') {
      return res.status(400).json({error: 'Amount is not defined'});
    }
    if (!amount) {
      return res.status(405).json({error: 'Amount cannot be zero', rightMethod: 'DELETE'});
    }
    let problem = 'No problem.';
    if (order.order.state !== 'cart') {
      const resData = await putBack(order.item._id, order.amount);
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
    }
    if (order.order.state !== 'cart') {
      const resData = await pullFrom(order.item._id, amount);
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
      if (resData.problem) {
        problem = resData.problem;
      }
      amount = resData.amount;
    }
    if (order.order.state === 'cart' || amount > order.amount) {
      order.bookPrice = order.book.price;
    }
    order.amount = amount;
    const savedOrder = await order.save();
    const newHeader = updateHeader(order.order);
    res.status(202).json({orderitem: savedOrder, message: problem, orderheader: newHeader});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an orderItem
const deleteOneOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const order = req.order;
    if (order.order.state !== 'cart') {
      const resData = await putBack(order.item._id, order.amount);
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
    }
    const deletedOrder = await OrderItem.findByIdAndDelete(id);
    const newHeader = updateHeader(order.order);
    res.status(202).json({orderitem: deletedOrder, orderheader: newHeader});
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
  putBack,
  pullFrom,
  updateHeader,
};
