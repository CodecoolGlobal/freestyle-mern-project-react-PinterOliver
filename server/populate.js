/* eslint-disable require-atomic-updates */
/* eslint-disable camelcase */
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const BookModel = require('./model/Book');
const RoleModel = require('./model/Role');
const StoredItemModel = require('./model/StoredItem');
const Book = require('./model/Book');
const OrderHeader = require('./model/OrderHeader');
const OrderItem = require('./model/OrderItem');
const UserModel = require('./model/User');

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
  await deleteOrders(); */
  await addUsers();

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

async function addUsers() {
  //await UserModel.deleteMany({});

  const addition = {
    userName: String,
    name: {
      first: String,
      last: String,
    },
    password: String,
    salt: String,
    email: String,
    role: { type: mongoose.Types.ObjectId, ref: 'Role' },
    delivery: {
      country: String,
      city: String,
      address: String,
      post_code: String,
    },
    telephone_number: String,
    token: [],
  };


  let users = [
    {
      'name': {
        'first': 'Tamás',
        'last': 'Molnár',
      },
      'userName': 'tomocza',
      'role': 'Admin',
    },
    {
      'name': {
        'first': 'Olivér Péter',
        'last': 'Pintér',
      },
      'userName': 'Oliviero',
      'role': 'Customer_service_agent',
    },
    {
      'name': {
        'first': 'András',
        'last': 'Tóth',
      },
      'userName': 'BurgerKing',
      'role': 'HR_manager',
    },
    {
      'name': {
        'first': 'Benedek',
        'last': 'Sebestyén',
      },
      'userName': 'Bebe',
      'role': 'Storekeeper',
    },
    {
      'userName': 'DanDan',
      'name': {
        'first': 'Dániel',
        'last': 'Tóth',
      },
      'role': 'Courier',
    },
    {
      'userName': 'SasszemÁdám',
      'name': {
        'first': 'Ádám',
        'last': 'Kozák',
      },
      'role': 'Accountant',
    },
    {
      'userName': 'DogLover',
      'name': {
        'first': 'Lajos',
        'last': 'Sávoly',
      },
      'role': 'Purchasing_agent',
    },
    {
      'userName': 'CousinAdam',
      'name': {
        'first': 'Ádám',
        'last': 'Dulai',
      },
      'role': 'Boss',
    },
  ];

  users = [...users, ...generateRandomUsers(10)];
  const userstext = users.map((user) => `${user.userName}\n${user.password}`).join('\n\n');
  console.log(userstext);
  fs.writeFile('../passwords.txt', userstext, (err) => {
    if (err) console.log(err);
  });


  /*   users.forEach(async (user) => {
    const userRole = await RoleModel.find({name: user.role.name});
    if (userRole) {
      user.role = userRole._id;
    } else {
      const defaultRole = await RoleModel.find({name: 'User'});
      user.role = defaultRole._id;
    }
    await user.save();
  });
  console.log('Users updated'); */

}

function generateRandomUsers(num) {
  // eslint-disable-next-line max-len
  const firstNames = ['Adam', 'Alex', 'Aaron', 'Ben', 'Carl', 'Dan', 'David', 'Edward', 'Fred', 'Frank', 'George', 'Hal', 'Hank', 'Ike', 'John', 'Jack', 'Joe', 'Larry', 'Monte', 'Matthew', 'Mark', 'Nathan', 'Otto', 'Paul', 'Peter', 'Roger', 'Roger', 'Steve', 'Thomas', 'Tim', 'Ty', 'Victor', 'Walter'];

  // eslint-disable-next-line max-len
  const lastNames = ['Anderson', 'Ashwoon', 'Aikin', 'Bateman', 'Bongard', 'Bowers', 'Boyd', 'Cannon', 'Cast', 'Deitz', 'Dewalt', 'Ebner', 'Frick', 'Hancock', 'Haworth', 'Hesch', 'Hoffman', 'Kassing', 'Knutson', 'Lawless', 'Lawicki', 'Mccord', 'McCormack', 'Miller', 'Myers', 'Nugent', 'Ortiz', 'Orwig', 'Ory', 'Paiser', 'Pak', 'Pettigrew', 'Quinn', 'Quizoz', 'Ramachandran', 'Resnick', 'Sagar', 'Schickowski', 'Schiebel', 'Sellon', 'Severson', 'Shaffer', 'Solberg', 'Soloman', 'Sonderling', 'Soukup', 'Soulis', 'Stahl', 'Sweeney', 'Tandy', 'Trebil', 'Trusela', 'Trussel', 'Turco', 'Uddin', 'Uflan', 'Ulrich', 'Upson', 'Vader', 'Vail', 'Valente', 'Van Zandt', 'Vanderpoel', 'Ventotla', 'Vogal', 'Wagle', 'Wagner', 'Wakefield', 'Weinstein', 'Weiss', 'Woo', 'Yang', 'Yates', 'Yocum', 'Zeaser', 'Zeller', 'Ziegler', 'Bauer', 'Baxster', 'Casal', 'Cataldi', 'Caswell', 'Celedon', 'Chambers', 'Chapman', 'Christensen', 'Darnell', 'Davidson', 'Davis', 'DeLorenzo', 'Dinkins', 'Doran', 'Dugelman', 'Dugan', 'Duffman', 'Eastman', 'Ferro', 'Ferry', 'Fletcher', 'Fietzer', 'Hylan', 'Hydinger', 'Illingsworth', 'Ingram', 'Irwin', 'Jagtap', 'Jenson', 'Johnson', 'Johnsen', 'Jones', 'Jurgenson', 'Kalleg', 'Kaskel', 'Keller', 'Leisinger', 'LePage', 'Lewis', 'Linde', 'Lulloff', 'Maki', 'Martin', 'McGinnis', 'Mills', 'Moody', 'Moore', 'Napier', 'Nelson', 'Norquist', 'Nuttle', 'Olson', 'Ostrander', 'Reamer', 'Reardon', 'Reyes', 'Rice', 'Ripka', 'Roberts', 'Rogers', 'Root', 'Sandstrom', 'Sawyer', 'Schlicht', 'Schmitt', 'Schwager', 'Schutz', 'Schuster', 'Tapia', 'Thompson', 'Tiernan', 'Tisler' ];

  const array = [];

  for (let i = 0; i < num; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    array.push(
      {
        'userName': `${first}${Math.floor((Math.random() * 89) + 10)}`,
        'name': {
          'first': first,
          'last': last,
        },
        'role': 'User',
      },
    );
  }

  return array;

}
