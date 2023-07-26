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
  fetchDeleteOneUser,
};
