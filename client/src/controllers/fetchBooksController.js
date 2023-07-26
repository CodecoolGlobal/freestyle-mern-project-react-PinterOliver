const fetchGetBooks = async (maxPrice, sort, page, perpage) => {
  const response = await fetch(`/api/books?maxprice=${maxPrice ?? ''}&sort=${sort ?? ''}&page=${page ?? ''}&perpage=${perpage ?? ''}`);
  return await response.json();
};

const fetchGetOneBook = async (book, id) => {
  const response = await fetch(`/api/books/${id}`);
  return await response.json();
};

const fetchPostOneBook = async (book) => {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem('token'),
    },
    body: JSON.stringify(book),
  });
  return await res.json();
};

const fetchPatchOneBook = async (id, book) => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem('token'),
    },
    body: JSON.stringify(book),
  });
  return await response.json();
};

const fetchDeleteOneBook = async (id) => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token'),
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
