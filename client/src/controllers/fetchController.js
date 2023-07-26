const fetchPostBooks = async (book) => {
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

const fetchDeleteBooks = async (id) => {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token'),
    },
  });
  return response.json();
};

const fetchGetBooks = async (maxPrice, sort, page, perpage) => {
  const response = await fetch(`/api/books?maxprice=${maxPrice ?? ''}&sort=${sort ?? ''}&page=${page ?? ''}&perpage=${perpage ?? ''}`);
  return await response.json();
};

module.exports = {
  fetchPostBooks,
  fetchDeleteBooks,
  fetchGetBooks,
};
