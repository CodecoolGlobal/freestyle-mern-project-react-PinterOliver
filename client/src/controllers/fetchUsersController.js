const API_URL = '/api/users';

const fetchGetUsers = async () => {
  const response = await fetch(API_URL, {
    headers: {
      token: localStorage.getItem('token'),
    },
  });
  return await response.json();
};

const fetchDeleteOneUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token'),
    },
  });
  return await response.json();
};

module.exports = {
  fetchGetUsers,
  fetchDeleteOneUser,
};
