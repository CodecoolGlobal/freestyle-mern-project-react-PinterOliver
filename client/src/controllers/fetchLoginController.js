const API_URL = '/api/login';

const fetchGetOneLogin = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

const fetchPostOneLogin = async (username, password) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return await response.json();
};

const fetchDeleteOneLogin = async () => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
  });
  return await response.json();
};

module.exports = {
  fetchGetOneLogin,
  fetchPostOneLogin,
  fetchDeleteOneLogin,
};
