const API_URL = '/api/users';
const TOKEN = () => localStorage.getItem('token');

const fetchGetUsers = async () => {
  const response = await fetch(API_URL, {
    headers: {
      token: TOKEN(),
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
      token: TOKEN(),
    },
  });
  return await response.json();
};

const fetchPutOneUserPassword = async (user) => {
  const response = await fetch(`${API_URL}/changepassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchDeleteOneUserPassword = async (user) => {
  const response = await fetch(`${API_URL}/changepassword`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return await response.json();
};

const fetchGetOneUserByEmail = async (email) => {
  const response = await fetch(`${API_URL}/email/${email}`);
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchPutOneUserSecurity = async (id) => {
  const response = await fetch(`${API_URL}/reset/${id}`, {
    method: 'PUT',
  });
  return await response.json();
};

module.exports = {
  fetchGetUsers,
  fetchPostOneUser,
  fetchDeleteOneUser,
  fetchPutOneUserPassword,
  fetchDeleteOneUserPassword,
  fetchGetOneUserByEmail,
  fetchPutOneUserSecurity,
};
