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

const fetchGetCartOrderHeader = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      token: TOKEN,
    },
  });
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchPostOneOrderHeader = async () => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

const fetchPatchOneOrderHeader = async (id, newstate) => {
  const response = await fetch(`${API_URL}/${id}`, {
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
  fetchGetCartOrderHeader,
  fetchPostOneOrderHeader,
  fetchPatchOneOrderHeader,
  fetchDeleteOneOrderHeader,
};
