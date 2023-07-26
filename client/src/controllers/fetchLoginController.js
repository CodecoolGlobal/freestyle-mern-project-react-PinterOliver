const API_URL = '/api/login';
const TOKEN = localStorage.getItem('token');

const fetchDeleteOneLogin = async () => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      token: TOKEN,
    },
  });
  return await response.json();
};

module.exports = {
  fetchDeleteOneLogin,
};
