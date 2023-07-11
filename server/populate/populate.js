/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');

const BookModel = require('../model/Book');
const RoleModel = require('../model/Role');
const StoredItemModel = require('../model/StoredItem');
const OrderHeaderModel = require('../model/OrderHeader');
const OrderItemModel = require('../model/OrderItem');
const UserModel = require('../model/User');

const firstNames = require('./firstNames.json');
const lastNames = require('./lastNames.json');
const genreList = require('./genres.json');
const states = require('./states.json');
const userList = require('./userList.json');

const { updateHeader } = require('../controllers/orderItemsController');

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
          book.price = (Math.floor(Math.random() * 300) * 10) + 509;
        }
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
      name: 'Customer_service_agent',
      canViewItems: true,
      canViewAllOrders: true,
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
    {
      name: 'Boss',
      canViewItems: true,
    },
  ];

  await RoleModel.create(...roles);
  console.log('Roles created');
}

async function populateStorage() {
  await StoredItemModel.deleteMany({});

  const books = await BookModel.find({});
  const storage = books.map((book) => {
    return {
      item: book._id,
      amount: Math.floor(Math.random() * 40) + 10,
    };
  });

  await StoredItemModel.create(...storage);
  console.log('Created storage');
}

async function populateOrders() {
  await OrderHeaderModel.deleteMany({});
  await OrderItemModel.deleteMany({});

  let users = await UserModel.find({});
  users = users.map((user) => user._id);
  let books = await BookModel.find({});
  books = books.map((book) => book._id);

  const cartUsers = users.filter(() => Math.random() < 0.5);

  for (const user of cartUsers) {
    await createOrder(user, 'cart', books);
  }

  const numberOfOrders = 100;
  for (let i = 0; i < numberOfOrders; i++) {
    const rand = Math.random();
    let state;
    if (rand < 0.15) state = states[1];
    else if (rand < 0.3) state = states[2];
    else if (rand < 0.45) state = states[3];
    else state = states[4];
    const user = users[Math.floor(Math.random() * users.length)];
    await createOrder(user, state, books);
    if (!(i % 10)) console.log(`Orders created (${i}/${numberOfOrders})`);
  }

  console.log('Created orders');
}

async function populateUsers() {
  await UserModel.deleteMany({});

  let users = structuredClone(userList);

  users = [...users, ...generateRandomUsers(10)];

  users = await Promise.all(users.map(async (user) => {
    user.token = [];

    const role = await RoleModel.findOne({name: user.role});
    user.role = role._id;

    const password = genPassword();
    user.literalPassword = password;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.salt = salt;
    user.password = hashedPassword;

    const number = user.userName.replace(/\D/gi, '');
    let email = `${user.name.first}.${user.name.last}${number}@gmail.com`;
    email = email
      .replace(/á/gi, 'a')
      .replace(/é/gi, 'e')
      .replace(/í/gi, 'i')
      .replace(/[óöő]/gi, 'o')
      .replace(/[úüű]/gi, 'u');
    user.email = email.toLowerCase();

    const {city, post} = genCity();
    user.delivery = {
      country: 'Magyarország',
      city: city,
      address: genStreet(),
      post_code: post,
    };

    user.telephone_number = genPhone();

    return user;
  }));

  const userstext = users.map((user) => `${user.userName}\n${user.literalPassword}`).join('\n\n');

  fs.writeFile('../passwords.txt', userstext, (err) => {
    if (err) console.log(err);
  });

  await UserModel.create(...users);

  console.log('Users created');
}

function generateRandomUsers(num) {
  const array = [];

  for (let i = 0; i < num; i++) {
    let first;
    let last;
    let userName;
    let name;
    const nameArray = [];
    const userNameArray = [];
    do {
      first = firstNames[Math.floor(Math.random() * firstNames.length)];
      last = lastNames[Math.floor(Math.random() * lastNames.length)];
      userName = `${first}${Math.floor((Math.random() * 89) + 10)}`;
      name = first + last;
    } while (
      userNameArray.includes(userName) ||
      nameArray.includes(name)
    );
    nameArray.push(name);
    userNameArray.push(userName);
    const newPerson = {
      'userName': userName,
      'name': {
        'first': first,
        'last': last,
      },
      'role': 'User',
    };
    array.push(newPerson);
  }

  return array;

}

function genPassword() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const passwordLength = 8;
  let password = '';
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars[randomNumber];
  }
  const randomNumber1 = Math.floor((Math.random() * 10) + 0);
  password += chars[randomNumber1];
  const randomNumber2 = Math.floor((Math.random() * 26) + 10);
  password += chars[randomNumber2];
  const randomNumber3 = Math.floor((Math.random() * 10) + 36);
  password += chars[randomNumber3];
  const randomNumber4 = Math.floor((Math.random() * 26) + 46);
  password += chars[randomNumber4];
  let newPassword = '';
  while (password.length > 0) {
    const rand = Math.floor(Math.random() * password.length);
    newPassword += password[rand];
    password = password.slice(0, rand) + password.slice(rand + 1);
  }
  return newPassword;
}

function genPhone() {
  let phone = '+36';
  const pre = ['20', '30', '70'];
  phone += pre[Math.floor(Math.random() * pre.length)];
  for (let i = 0; i < 7; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

async function createOrder (user, state, books) {
  const header = {
    user: user,
    state: state,
  };
  const orderHeader = await OrderHeaderModel.create(header);
  const rounds = Math.floor(Math.random() * 5) + 1;
  const used = [];

  for (let i = 0; i < rounds; i++) {
    const bookid = books[Math.floor(Math.random() * books.length)];
    if (!used.includes(bookid)) {
      const book = await BookModel.findById(bookid);
      used.push(bookid);
      const rand = Math.floor(Math.random() * 5) + 1;
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
