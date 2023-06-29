import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import Loading from '../../components/Loading';
import OrdersTable from '../../components/OrdersTable';

function AdminOrderList() {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orderheaders', {headers: {
        token: localStorage.getItem('token')
      }});
      const jsonData = await response.json();
      setOrderList(jsonData.orderheaders);
      setLoading(false);
    };
    console.log(orderList);
    fetchOrders();
  }, []);

  function getLastPart(url) {
    const parts = url.split('/');
    return parts.at(-1);
  }

  const handleDelete = async (id) => {
    // const response = await fetch(`/api/oders/${id}`, {
    //   method: 'DELETE',
    // });
    const response = await fetch(`/api/orderheaders/${id}`)
    const orderHeaderId = getLastPart(response.url)

    const orderItemsResponse = await fetch(`/api/oderitems/orderheaders/${orderHeaderId}`, {headers: {
      token: localStorage.getItem('token')
    }});
    const jsonData = await orderItemsResponse.json();
      setOrderList(jsonData.orders);

    console.log(orderItemsResponse)
    console.log(await response.json());
    setOrderList(orderList.filter((order) => order._id !== id));
  };

  if (loading) return <Loading />;

  return <OrdersTable orderList={orderList} onDelete={handleDelete} />;
}

export default AdminOrderList;
