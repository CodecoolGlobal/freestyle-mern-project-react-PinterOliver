/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const BookModel = require('../model/Book');
const RoleModel = require('../model/Role');
const StoredItemModel = require('../model/StoredItem');
const OrderHeaderModel = require('../model/OrderHeader');
const OrderItemModel = require('../model/OrderItem');
const UserModel = require('../model/User');

const genreList = require('./genres.json');
const states = require('./states.json');
const userList = require('./userList.json');

const { updateHeader } = require('../controllers/orderItemsController');
const {
  pick,
  generateNumber,
  generateDate,
  generateCity,
  generateStreet,
  generatePassword,
  generatePhone,
  generateRandomUsers,
  generateEmail,
} = require('./generateParts');

const START_DAY = new Date('2001-10-09');
const TODAY = new Date();

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
  await populateUsers();
  await populateOrders();

  await mongoose.disconnect();
  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function populateBooks() {
  await BookModel.deleteMany({});

  let count = 0;
  const maxCount = genreList.length * 200;

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
          publishedYear: Number(String(book.volumeInfo.publishedDate).substring(0, 4)),
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
          !book.genres ||
          !book.genres.length ||
          !book.publishedYear ||
          !book.description ||
          array.slice(0, index).some((item) => item.title === book.title)
        ) return false;
        return true;
      });

      books.forEach((book) => {
        if (!book.price) {
          book.price = (generateNumber(0, 300) * 10) + 509;
        }
        book.createdAt = generateDate(START_DAY, TODAY);
      });

      await BookModel.create(...books);
      count += books.length;
      console.log(`Books created (${count}/${maxCount})`);
    }
  }

  const books = await BookModel.find({});
  let counter = 0;

  await Promise.all(books.map(async (book, index, array) => {
    if (array.slice(0, index).some((item) => item.title === book.title)) {
      counter++;
      return await BookModel.findByIdAndDelete(book._id);
    }
    return {};
  }));

  console.log(`${count - counter} books created alltogether`);
}

async function populateRoles() {
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
      name: 'Customer service agent',
      canViewItems: true,
      canViewAllOrders: true,
      canViewAllUsers: true,
    },
    {
      name: 'HR manager',
      canViewItems: true,
      canViewAllUsers: true,
      canModifyRoles: true,
    },
    {
      name: 'Purchasing agent',
      canViewItems: true,
      canModifyItems: true,
    },
    {
      name: 'Courier',
      canViewItems: true,
      canViewAllOrders: true,
    },
    {
      name: 'Boss',
      canViewItems: true,
    },
  ];

  roles.forEach((item) => {
    item.createdAt = START_DAY;
  });

  await RoleModel.create(...roles);
  console.log('Roles created');
}

async function populateStorage() {
  await StoredItemModel.deleteMany({});

  const books = await BookModel.find({});
  const storage = books.map((book) => {
    return {
      item: book._id,
      amount: generateNumber(10, 50),
      createdAt: book.createdAt,
    };
  });

  await StoredItemModel.create(...storage);
  console.log('Created storage');
}

async function populateOrders() {
  await OrderHeaderModel.deleteMany({});
  await OrderItemModel.deleteMany({});

  const users = await UserModel.find({});

  const cartUsers = users.filter(() => Math.random() < 0.5);

  for (const user of cartUsers) {
    await createOrder(user, 'cart');
  }

  const numberOfOrders = 100;
  for (let i = 0; i < numberOfOrders; i++) {
    const rand = Math.random();
    let state;
    if (rand < 0.15) state = states[1];
    else if (rand < 0.3) state = states[2];
    else if (rand < 0.45) state = states[3];
    else state = states[4];
    const user = pick(users);
    await createOrder(user, state);
    if (!(i % 10)) console.log(`Orders created (${i}/${numberOfOrders})`);
  }

  console.log('Created orders');
}

async function populateUsers() {
  await UserModel.deleteMany({});

  const userCount = 20;
  const userNumber = Math.max(userCount - userList.length, 0);
  let users = [...structuredClone(userList), ...generateRandomUsers(userNumber)];

  users = await Promise.all(users.map(async (user) => {
    user.token = [];

    const role = await RoleModel.findOne({name: user.role});
    user.role = role._id;

    const {literalPassword, hashedPassword} = generatePassword();
    user.literalPassword = literalPassword;
    user.password = hashedPassword;

    user.email = generateEmail(user);

    const {city, post} = generateCity();
    user.delivery = {
      country: 'Magyarország',
      city: city,
      address: generateStreet(),
      post_code: post,
    };

    user.telephone_number = generatePhone();
    user.createdAt = generateDate(START_DAY, TODAY);

    return user;
  }));

  const userstext = users.map((user) => `${user.userName}\n${user.literalPassword}`).join('\n\n');

  fs.writeFile('../passwords.txt', userstext, (err) => {
    if (err) console.log(err);
  });

  await UserModel.create(...users);

  console.log('Users created');
}

async function createOrder (user, state) {
  let orderDate = generateDate(user.createdAt, TODAY);
  const header = {
    user: user._id,
    state: state,
    createdAt: orderDate,
  };

  const orderHeader = await OrderHeaderModel.create(header);
  const rounds = generateNumber(1, 5);
  const used = [];

  for (let i = 0; i < rounds; i++) {
    orderDate = generateDate(orderDate, TODAY);
    const books = await BookModel.find({createdAt: {$lt: orderDate}});
    const bookid = pick(books)._id;

    if (!used.includes(bookid)) {
      const book = await BookModel.findById(bookid);
      used.push(bookid);
      const rand = generateNumber(1, 5);
      const item = {
        item: book._id,
        order: orderHeader._id,
        amount: rand,
        bookPrice: book.price,
        price: rand * book.price,
      };
      await OrderItemModel.create(item);
    }
  }

  await updateHeader(orderHeader);
}
