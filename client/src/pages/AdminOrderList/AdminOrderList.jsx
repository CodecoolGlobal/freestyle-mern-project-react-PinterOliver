import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import OrdersTable from '../../components/OrdersTable';
import Loading from '../../components/Loading';

function AdminOrderList() {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      const jsonData = await response.json();
      setOrderList(jsonData.orders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/oders/${id}`, {
      method: 'DELETE',
    });
    console.log(await response.json());
    setOrderList(orderList.filter((order) => order._id !== id));
  };

  if (loading) return <Loading />;

  return <OrdersTable orderList={orderList} onDelete={handleDelete} />;
}

export default AdminOrderList;
