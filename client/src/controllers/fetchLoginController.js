const API_URL = '/api/login';

const fetchDeleteOneLogin = async () => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token'),
    },
  });
  return await response.json();
};

module.exports = {
  fetchDeleteOneLogin,
};
