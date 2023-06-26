require('dotenv').config();
const mongoose = require('mongoose');
const BookModel = require('./model/Book');
const RoleModel = require('./model/Role');

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

  await mongoose.disconnect();
  console.log('Disconnected from DB');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function populateBooks() {
  await BookModel.deleteMany({});

  const maxAmount = 200;
  const interval = 40;

  for (let fetchedAmount = 0; fetchedAmount < maxAmount; fetchedAmount += interval) {
    const fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=${interval}&startIndex=${fetchedAmount}`;

    const response = await fetch(fetchUrl);
    const jsonData = await response.json();

    const books = jsonData.items.map((book) => {
      return {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : null,
        publishedYear: String(book.volumeInfo.publishedDate).substring(0, 4),
        price: book.saleInfo.listPrice?.amount,
        genres: book.volumeInfo.categories,
        description: book.volumeInfo.description,
      };
    });

    await BookModel.create(...books);
    console.log(`Books created (${fetchedAmount + interval}/${maxAmount})`);
  }
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
      canAccessStorage: true,
    },
  ];

  await RoleModel.create(...roles);
  console.log('Roles created');
}
