import React, { useState } from 'react';
import './OrderHeadersTable.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useNavigate } from 'react-router';

function OrderHeadersTable({ orderList, onLearnMore, onDelete }) {
  console.log(orderList);
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState('');

  return (
    <table>
      <thead>
        <tr>
          <th>Total price of the order</th>
          <th>State of the order</th>
          <th>Date of the order</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order) => (
          <tr key={order._id}>
            <td>{order.totalPrice}</td>
            <td>{order.state}</td>
            <td>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</td>
            <td>
              {expandedRow === order._id ? (
                <>
                  {' '}
                  <button onClick={() => onLearnMore(order._id)}>Learn more</button>
                  <button onClick={() => onDelete(order._id)}>Delete order</button>
                  <button onClick={() => navigate(`update/${order._id}`)}>
                    Update order state
                  </button>
                  <button onClick={() => navigate(`update/${order._id}`)}>
                    Update order details
                  </button>
                  <button onClick={() => setExpandedRow('')}>-</button>
                </>
              ) : (
                <>
                  <button onClick={() => setExpandedRow(order._id)}>+</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderHeadersTable;
