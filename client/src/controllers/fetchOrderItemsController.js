const API_URL = '/api/orderitems';

const fetchGetOrderItems = async (orderHeaderId) => {
  const moreInfoResponse = await fetch(`${API_URL}/orderheaders/${orderHeaderId}`,
    {headers: {
      token: localStorage.getItem('token'),
    }});
  return await moreInfoResponse.json();
};

const fetchDeleteOneOrderItem = async (orderItemId) => {
  const response = await fetch(`${API_URL}/${orderItemId}`, {headers: {
    token: localStorage.getItem('token'),
  },
  method: 'DELETE',
  });
  return await response.json();
};

module.exports = {
  fetchGetOrderItems,
  fetchDeleteOneOrderItem,
};
