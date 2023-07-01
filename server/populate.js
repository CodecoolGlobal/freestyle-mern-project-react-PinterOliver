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

/*   await populateBooks();
  await populateRoles();
  await populateStorage();
  await deleteOrders();

  await mongoose.disconnect(); */
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

  const books = await Book.find({});
  let counter = 0;

  await Promise.all(books.map(async (book, index, array) => {
    if (array.slice(0, index).some((item) => item.title === book.title)) {
      counter++;
      return await Book.findByIdAndDelete(book._id);
    }
    return {};
  }));

  console.log(`${count - counter} books created alltogether`);
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
      name: 'Customer_service_agent',
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
/*
async function addUsers() {

  "delivery": {
    "country": ,
    "city": ,
    "address": ,
    "post_code": 
  },


  const users = [
    {
      "name": {
        "first": "Tamás",
        "last": "Molnár"
      },
      "userName": "tomocza",
      "password": "$2b$10$n1X1z5liGvv7FT1DSFndDOOqvKZbDu3Fi5ntlfZ7WASKV6Wadns5S",
      "email": "tomi@astala.hu",
      "telephone_number": "+36201515341",
      "token": [],
      "role": ,
      "salt": "$2b$10$n1X1z5liGvv7FT1DSFndDO"
    },
    {
      "name": {
        "first": "Béla",
        "last": "Kovács"
      },
      "userName": "pörköltvacak",
      "password": "$2b$10$KHjxMv01H2nP9.csSFHhiexc9Ae7ZFKcbOoJPewQBMgu4rxTX.ioW",
      "email": "toth.Kovács@gmail.com",
      "telephone_number": "+36206548989",
      "token": [],
      "role": ,
      "salt": "$2b$10$KHjxMv01H2nP9.csSFHhie"
    },
    {
      "name": {
        "first": "Kakszi",
        "last": "Lajos"
      },
      "userName": "kakszilali",
      "password": "$2b$10$MCC99NLphU2n.puhVQx59.GEFM3klj8mT2UsYY8mO0TpCV4.meMie",
      "salt": "$2b$10$MCC99NLphU2n.puhVQx59.",
      "email": "kakszilali@gmail.com",
      "role": ,
      "token": [],
    },
    {
      "name": {
        "first": "Olivér Péter",
        "last": "Pintér"
      },
      "userName": "Oliviero",
      "password": "$2b$10$EKRSYo5dxtrj2obV6rIn4Oko3/CcSxfqklGf3KHvm4OvK6d/CdlkC",
      "salt": "$2b$10$EKRSYo5dxtrj2obV6rIn4O",
      "email": "oliver.pinter@gmail.com",
      "role": ,
      "token": []
    },
    {
      "name": {
        "first": "András",
        "last": "Tóth"
      },
      "userName": "BurgerKing",
      "password": "$2b$10$U/27pe82YV2n9Y9ztlQYZOLOk0mAxBpKiXEFzKQRvs/fUIYm4ND.S",
      "email": "toth.andras@gmail.com",
      "telephone_number": "+36206548989",
      "token": [],
      "role": ,
      "salt": "$2b$10$U/27pe82YV2n9Y9ztlQYZO"
    },
    {
      "name": {
        "first": "Benedek",
        "last": "Sebestyén"
      },
      "userName": "Bebe",
      "password": "$2b$10$covZUPm9xpCOyQm5q5WT7e1fr6MrPyTsmYX2cT//3XLNCWZEsobrO",
      "salt": "$2b$10$covZUPm9xpCOyQm5q5WT7e",
      "email": "sebibebe@gmail.com",
      "role": ,
      "token": []
    }
  ]

}
 */
