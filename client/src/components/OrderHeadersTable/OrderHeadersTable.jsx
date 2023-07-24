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
          <th className="totPriceCol">Total price</th>
          <th className="stateCol">State</th>
          <th className="dateCol">Date created</th>
          <th className="btnCol"></th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order) => (
          <tr key={order._id}>
            <td className="totPriceCol">{order.totalPrice.toLocaleString('hu')}</td>
            <td className="stateCol">{order.state}</td>
            <td className="dateColt">
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
            </td>
            <td className="btnCol">
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
