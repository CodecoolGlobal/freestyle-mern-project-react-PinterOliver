import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import Loading from '../../components/Loading';
import OrderHeadersTable from '../../components/OrderHeadersTable';
import OrderItemsTable from '../../components/OrderItemsTable';

import {
  fetchGetOrderHeaders,
  fetchDeleteOneOrderHeader,
} from '../../controllers/fetchOrderHeadersController';
import {
  fetchGetOrderItems,
  fetchDeleteOneOrderItem,
} from '../../controllers/fetchOrderItemsController';

function AdminOrderList() {
  const [loading, setLoading] = useState(true);
  const [orderHeaderList, setOrderHeaderList] = useState([]);
  const [orderItemList, setOrderItemList] = useState([]);
  const [sideType, setSideType] = useState('');

  const fetchOrders = async () => {
    const response = await fetchGetOrderHeaders();
    setOrderHeaderList(response.orderheaders);
    setSideType('headers');
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLearnMore = async (orderHeaderId) => {
    const response = await fetchGetOrderItems(orderHeaderId);
    setSideType('items');
    setOrderItemList(response.orderitems);
  };

  const handleLearnLess = async () => {
    await fetchOrders();
  };

  const handleDelete = async (id) => {
    const response = await fetchDeleteOneOrderHeader();
    console.log(response);
    setOrderHeaderList(orderHeaderList.filter((order) => order._id !== id));
  };

  const handleDeleteItem = async (id) => {
    const response = await fetchDeleteOneOrderItem();
    console.log(response);
    setOrderItemList(orderItemList.filter((order) => order._id !== id));
  };

  if (loading) return <Loading />;

  return (sideType === 'headers') ? (
    <OrderHeadersTable orderList={orderHeaderList} onLearnMore={handleLearnMore}
      onDelete={handleDelete}/>
  ) : (sideType === 'items') ? (
    <OrderItemsTable orderList={orderItemList} onLearnLess={handleLearnLess}
      onDelete={handleDeleteItem} onGoBack={handleLearnLess}/>
  ) : (
    <Loading />
  );
}

export default AdminOrderList;
