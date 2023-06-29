import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import Loading from '../../components/Loading';
import OrdersHeadersTable from '../../components/OrdersHeadersTable';

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

  const handleLearnMore = async (id) => {
    const response = await fetch(`/api/orderheaders/${id}`)
    const orderHeaderId = getLastPart(response.url)

    const moreInfoResponse = await fetch(`/api/orderitems/orderheaders/${orderHeaderId}`, {headers: {
      token: localStorage.getItem('token')
    }});
    const jsonData = await moreInfoResponse.json();
    setOrderList(jsonData.orders);
    console.log(jsonData) 
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

  return <OrdersHeadersTable orderList={orderList} onLearnMore={handleLearnMore} />;
}

export default AdminOrderList;
