import React, { useEffect, useState } from 'react';
import OrderHeaderForm from '../../components/OrderHeaderForm/OrderHeaderForm';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';

function AdminOrderUpdater() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await fetch(`/api/orderheaders/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.getItem('token'),
        }});
      const jsonData = await response.json();
      setOrder(jsonData.orderheader);
      setLoading(false);
    };
    fetchOrders();
  }, [id]);

  const handleSave = async (order) => {
    setLoading(true);
    await fetch(`/api/orderheaders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify({newstate: order.state}),
    });
    console.log(order);
    setLoading(false);
    navigate('/admin/orders');
  };

  if (loading) return <Loading />;

  return <OrderHeaderForm order={order} onCancel={() => navigate('/admin/orders')} onSave={handleSave} />;
}

export default AdminOrderUpdater;
