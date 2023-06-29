/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
require('dotenv').config();
const mongoose = require('mongoose');
const BookModel = require('./model/Book');
const RoleModel = require('./model/Role');
const StoredItemModel = require('./model/StoredItem');
const Book = require('./model/Book');
const OrderHeader = require('./model/OrderHeader');
const OrderItem = require('./model/OrderItem');
const User = require('./model/User');
const Role = require('./model/Role');

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const main = async () => {
  console.log('Connecting to DB');
  await mongoose.connect(mongoUrl);
  console.log('Successfully connected to DB');

  await populateBooks();
  await populateRoles();
  await populateStorage();
  await deleteOrders();

  await mongoose.disconnect();
  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function populateBooks() {
  await BookModel.deleteMany({});

  const genreList = [
    'fiction',
    'drama',
    'fantasy',
    'history',
    'children',
    'horror',
    'thriller',
    'biography',
    'crime',
    'philosophy',
    'poetry',
  ];

  for (const genre of genreList) {

    const maxAmount = 200;
    const interval = 40;

    for (let fetchedAmount = 0; fetchedAmount < maxAmount; fetchedAmount += interval) {
      const fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=${interval}&startIndex=${fetchedAmount}`;

      const response = await fetch(fetchUrl);
      const jsonData = await response.json();

      let books = jsonData.items.map((book) => {
        return {
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : null,
          publishedYear: String(book.volumeInfo.publishedDate).substring(0, 4),
          price: book.saleInfo.listPrice?.amount,
          genres: book.volumeInfo.categories,
          description: book.volumeInfo.description,
          image_url: book.volumeInfo.imageLinks?.thumbnail ?? '',
        };
      });

      books = books.filter((book, index, array) => {
        if (
          !book.title ||
          !book.author ||
          !book.image_url ||
          !book.genres.length ||
          !book.publishedYear ||
          !book.description ||
          array.slice(0, index).some((item) => item.title === book.title)
        ) return false;
        return true;
      });

      books = books.forEach((book) => {
        if (!book.price) {
          book.price = (Math.floor(Math.random() * 300) * 10) + 509;
        }
      });

      await BookModel.create(...books);
      console.log(`Books created (${fetchedAmount + interval}/${maxAmount})`);
    }
  }
}

async function populateRoles() {
  const users = await User.find({}).populate('role');

  await RoleModel.deleteMany({});

  const roles = [
    {
      name: 'User',
      canViewItems: true,
    },
    {
      name: 'Admin',
      canViewItems: true,
      canModifyItems: true,
      canViewAllOrders: true,
      canViewAllUsers: true,
      canModifyRoles: true,
      canAccessStorage: true,
    },
    {
      name: 'Accountant',
      canViewItems: true,
      canViewAllOrders: true,
      canAccessStorage: true,
    },
    {
      name: 'Storekeeper',
      canViewItems: true,
      canAccessStorage: true,
    },
    {
      name: 'Customer_service_employee',
      canViewItems: true,
      canViewAllUsers: true,
    },
    {
      name: 'HR_manager',
      canViewItems: true,
      canViewAllUsers: true,
      canModifyRoles: true,
    },
    {
      name: 'Purchasing_agent',
      canViewItems: true,
      canModifyItems: true,
    },
    {
      name: 'Courier',
      canViewItems: true,
      canViewAllOrders: true,
    },
  ];

  await RoleModel.create(...roles);
  console.log('Roles created');

  users.forEach(async (user) => {
    const userRole = await Role.find({name: user.role.name});
    if (userRole) {
      user.role = userRole._id;
    } else {
      const defaultRole = await Role.find({name: 'User'});
      user.role = defaultRole._id;
    }
    await user.save();
  });
  console.log('Users updated');
}

async function populateStorage() {
  await StoredItemModel.deleteMany({});

  const books = await Book.find({});
  const storage = books.map((book) => {
    return {
      item: book._id,
      amount: Math.floor(Math.random() * 40),
    };
  });

  await StoredItemModel.create(...storage);
  console.log('Created storage');
}

async function deleteOrders() {
  await OrderHeader.deleteMany({});
  await OrderItem.deleteMany({});
}
