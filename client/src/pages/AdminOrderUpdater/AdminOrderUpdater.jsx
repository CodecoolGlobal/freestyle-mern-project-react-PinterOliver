import React, { useEffect, useState } from 'react';
import OrderHeaderForm from '../../components/OrderHeaderForm/OrderHeaderForm';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import {
  fetchGetOneOrderHeader,
  fetchPatchOneOrderHeader,
} from '../../controllers/fetchOrderHeadersController';

function AdminOrderUpdater() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await fetchGetOneOrderHeader();
      setOrder(response.orderheader);
      setLoading(false);
    };
    fetchOrders();
  }, [id]);

  const handleSave = async (orderData) => {
    setLoading(true);
    const response = await fetchPatchOneOrderHeader(id, orderData.state);
    console.log(response);
    setLoading(false);
    navigate('/admin/orders');
  };

  if (loading) return <Loading />;

  return <OrderHeaderForm
    order={order}
    onCancel={() => navigate('/admin/orders')}
    onSave={handleSave}
  />;
}

export default AdminOrderUpdater;
