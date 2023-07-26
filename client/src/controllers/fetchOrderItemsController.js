const API_URL = '/api/orderitems';

const fetchGetOrderItems = async (orderHeaderId) => {
  const moreInfoResponse = await fetch(`${API_URL}/orderheaders/${orderHeaderId}`,
    {headers: {
      token: localStorage.getItem('token'),
    }});
  return await moreInfoResponse.json();
};

const fetchPostOneOrderItem = async (orderHeaderId, orderItem) => {
  const response = await fetch(`/api/orderitems/orderheaders/${orderHeaderId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      bookid: orderItem.id,
      amount: Number(orderItem.amount),
    }),
  });
  const jsonData = await response.json();
  jsonData.status = response.status;
  return jsonData;
};

const fetchPatchOneOrderItem = async (orderItemId, orderItem) => {
  const otherData = await fetch(`/api/orderitems/${orderItemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      bookid: orderItem.id,
      amount: Number(orderItem.amount),
    }),
  });
  return await otherData.json();
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
  fetchPostOneOrderItem,
  fetchPatchOneOrderItem,
  fetchDeleteOneOrderItem,
};
