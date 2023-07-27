const API_URL = '/api/orderheaders';

const fetchGetOrderHeaders = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

const fetchGetOneOrderHeader = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};

const fetchGetCartOrderHeader = async () => {
  const response = await fetch(`${API_URL}/cart`);
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchPostOneOrderHeader = async () => {
  const response = await fetch(API_URL, {
    method: 'POST',
  });
  return await response.json();
};

const fetchPatchOneOrderHeader = async (id, newstate) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({newstate}),
  });
  return await response.json();
};

const fetchDeleteOneOrderHeader = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
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
