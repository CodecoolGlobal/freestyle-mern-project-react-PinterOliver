const API_URL = '/api/books';
const { readCookie } = require('./cookieController');
const TOKEN = () => {
  console.log('cookie: ', readCookie('token'));
  return localStorage.getItem('token');
};

const fetchGetBooks = async (maxPrice, sort, page, perpage) => {
  const response =
    await fetch(`${API_URL}?maxprice=${maxPrice ?? ''}&sort=${sort ?? ''}&page=${page ?? ''}&perpage=${perpage ?? ''}`);
  return await response.json();
};

const fetchGetOneBook = async (book, id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};

const fetchPostOneBook = async (book) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: TOKEN(),
    },
    body: JSON.stringify(book),
  });
  return await res.json();
};

const fetchPatchOneBook = async (id, book) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      token: TOKEN(),
    },
    body: JSON.stringify(book),
  });
  return await response.json();
};

const fetchDeleteOneBook = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      token: TOKEN(),
    },
  });
  return response.json();
};

module.exports = {
  fetchGetBooks,
  fetchGetOneBook,
  fetchPostOneBook,
  fetchPatchOneBook,
  fetchDeleteOneBook,
};
