const API_URL = '/api/orderheaders';
const TOKEN = localStorage.getItem('token');

const fetchGetOrderHeaders = async () => {
  const response = await fetch(API_URL, {
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

const fetchGetOneOrderHeader = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

const fetchPatchOneOrderHeader = async (id, newstate) => {
  const response = await fetch(`/api/orderheaders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      token: TOKEN,
    },
    body: JSON.stringify({newstate}),
  });
  return await response.json();
};

const fetchDeleteOneOrderHeader = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

module.exports = {
  fetchGetOrderHeaders,
  fetchGetOneOrderHeader,
  fetchPatchOneOrderHeader,
  fetchDeleteOneOrderHeader,
};
