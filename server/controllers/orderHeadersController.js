/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const OrderHeader = require('../model/OrderHeader.js');
const OrderItem = require('../model/OrderItem.js');
const { arraySearch } = require('./filterAndSort.js');
const { putBack, pullFrom, updateHeader } = require('./orderItemsController');

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

//CREATE a new orderHeader
const addOneOrderHeader = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const isExist = await OrderHeader.findOne({user: user._id, state: 'cart'});
    if (isExist) {
      return res.status(405).json({
        orderheader: isExist,
        message: 'Cart already exists',
        rightMethod: 'PATCH',
      });
    }
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

// Update orderitems and storeditems
const updateItems = async (orderid, type) => {
  const items = await OrderItem.find({order: orderid}).populate('item');
  const allData = await Promise.all(items.map(async (order) => {
    let resData = {};
    switch (type) {
    case 'put':
      resData = await putBack(order.item._id, order.amount);
      break;
    case 'pull':
      resData = await pullFrom(order.item._id, order.amount);
      break;
    }
    return resData;
  }));
  const answer = {success: allData.reduce((total, data) => total && data.success, true)};
  if (!answer.success) {
    answer.problem = allData.reduce((total, data) => `${total}\n-${data.problem}`, 'Problems:');
  }
  return answer;
};

//UPDATE an orderHeader
const updateOneOrderHeader = async (req, res) => {
  try {
    const order = req.order;
    const newState = req.body.newstate;
    if (!newState) {
      return res.status(400).json({error: 'New state is not defined'});
    }
    const states = [
      'cart',
      'placed',
      'order_confirmed',
      'transferred_to_shipping',
      'order_completed',
    ];
    if (!states.includes(newState)) {
      return res.status(400).json({error: 'Invalid state'});
    }
    if (order.state === 'cart' && newState !== 'cart') {
      const resData = await updateItems(order._id, 'put');
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
    }
    if (order.state !== 'cart' && newState === 'cart') {
      const resData = await updateItems(order._id, 'pull');
      if (!resData.success) {
        return res.status(404).json({error: resData.problem});
      }
    }
    order.state = newState;
    const savedOrder = await order.save();
    const updatedOrder = updateHeader(savedOrder);
    res.status(202).json({orderheader: updatedOrder});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE an orderHeader
const deleteOneOrderHeader = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedItems = await OrderItem.deleteMany({order: id});
    console.log(deletedItems);
    const deletedOrder = await OrderHeader.findByIdAndDelete(id);
    console.log(deletedOrder);
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
      return res.status(204).json({message: 'User has an empty cart', orderheader: order});
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
