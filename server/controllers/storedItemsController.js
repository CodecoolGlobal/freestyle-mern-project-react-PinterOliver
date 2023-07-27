/* eslint-disable require-atomic-updates */
/* eslint-disable consistent-return */
const StoredItem = require('../model/StoredItem');

const {
  numberSearch,
  toSort,
} = require('./filterAndSort');

// GET all stored items
const getAllStoredItems = async (req, res) => {
  try {
    const { maxamount, sort } = req.query;
    let search = {};
    if (maxamount) {
      const numberMaxamount = Number(maxamount);
      search = numberSearch(search, 'amount', numberMaxamount, 'lte');
    }
    let sortBy = {
      'amount': 1,
    };
    if (sort) {
      const [type, ascend] = sort.split(',');
      sortBy = toSort(sortBy, type, ascend);
    }
    const storedItems = await StoredItem.find(search).sort(sortBy).populate('item');
    res.status(200).json({storeditems: storedItems});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// GET one stored item
const getOneStoredItem = (req, res) => {
  try {
    const storedItem = req.storedItem;
    res.status(200).json({storeditem: storedItem});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE one stored item
const updateOneStoredItem = async (req, res) => {
  try {
    const storedItem = req.storedItem;
    const { amount } = req.body;
    if (typeof amount !== 'number') {
      return res.status(400).json({error: 'Amount is not defined'});
    }
    if (amount < 0) {
      return res.status(405).json({
        error: 'Amount cannot be less than zero',
        rightMethod: 'DELETE',
      });
    }
    storedItem.amount = amount;
    const savedItem = await storedItem.save();
    res.status(200).json({storeditem: savedItem});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllStoredItems,
  getOneStoredItem,
  updateOneStoredItem,
};
