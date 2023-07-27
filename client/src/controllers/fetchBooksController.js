const API_URL = '/api/books';

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
    },
    body: JSON.stringify(book),
  });
  return await response.json();
};

const fetchDeleteOneBook = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
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
