const { json } = require( "express" );

const API_URL = '/api/users';
const TOKEN = localStorage.getItem('token');

const fetchGetUsers = async () => {
  const response = await fetch(API_URL, {
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

const fetchPostOneUser = async (user) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchDeleteOneUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

module.exports = {
  fetchGetUsers,
  fetchPostOneUser,
  fetchDeleteOneUser,
};
