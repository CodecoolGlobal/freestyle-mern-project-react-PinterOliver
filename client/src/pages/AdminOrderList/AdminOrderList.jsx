import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';
import Loading from '../../components/Loading';
import OrderHeadersTable from '../../components/OrderHeadersTable';
import OrderItemsTable from '../../components/OrderItemsTable';
// import { useNavigate, useParams } from 'react-router';

function AdminOrderList() {
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [sideType, setSideType] = useState('');
  // const { id } = useParams();
  // const navigate = useNavigate();

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
    console.log(await response)
    setOrderList(orderList.filter((order) => order._id !== id));
  };

  const handleDeleteItem = async (id) => {
    const response = await fetch(`/api/orderitems/${id}`, {headers: {
      token: localStorage.getItem('token')
    },
    method: 'DELETE',
    })
    console.log(await response)
    setOrderList(orderList.filter((order) => order._id !== id));
  };

  // const handleUpdate = async (orderHeader) => {
  //   setLoading(true);
  //   await fetch(`/api/orderitems/${id}`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-type': 'application/json',
  //     token: localStorage.getItem('token'),
  //   },
  //   body: JSON.stringify(orderHeader),
  // });
  // setLoading(false);
  // navigate('/admin/orders');
  // }


  if (loading) return <Loading />;

  return (sideType === 'headers') ? (
    <OrderHeadersTable orderList={orderList} onLearnMore={handleLearnMore} 
    onDelete={handleDelete}/>
  ) : (sideType === 'items') ? (
    <OrderItemsTable orderList={orderList} onLearnLess={handleLearnLess} 
    onDelete={handleDeleteItem} onGoBack={handleLearnLess}/>
  ) : (
    <Loading />
  )
}

export default AdminOrderList;