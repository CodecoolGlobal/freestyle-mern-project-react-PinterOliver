import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import Loading from '../../components/Loading';
import OrderHeadersTable from '../../components/OrderHeadersTable';
import OrderItemsTable from '../../components/OrderItemsTable';

function AdminOrderList() {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [sideType, setSideType] = useState('');

  const fetchOrders = async () => {
    const response = await fetch('/api/orderheaders', {headers: {
      token: localStorage.getItem('token')
    }});
    const jsonData = await response.json();
    setOrderList(jsonData.orderheaders);
    setSideType('headers');
    setLoading(false);
  };

  useEffect(() => {
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
    setSideType('items')
    console.log(jsonData.orderitems)
    console.log(orderHeaderId)
    setOrderList(jsonData.orderitems);
  }

  const handleLearnLess = async () => {
    fetchOrders()
  }

  const handleDelete = async (id) => {
    const response = await fetch(`/api/orderheaders/${id}`, {headers: {
      token: localStorage.getItem('token')
    },
    method: 'DELETE',
    })
    // const orderHeaderId = getLastPart(response.url)
    console.log(await response)
    console.log(await response.json());
    setOrderList(orderList.filter((order) => order._id !== id));
  };


  if (loading) return <Loading />;

  return (sideType === 'headers') ? (
    <OrderHeadersTable orderList={orderList} onLearnMore={handleLearnMore} onDelete={handleDelete}/>
  ) : (sideType === 'items') ? (
    <OrderItemsTable orderList={orderList} onLearnLess={handleLearnLess} />
  ) : (
    <Loading />
  )
}

export default AdminOrderList;
