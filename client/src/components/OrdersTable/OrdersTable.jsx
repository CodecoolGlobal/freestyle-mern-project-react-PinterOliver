import React from 'react';
import './OrdersTable.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function OrdersTable({ orderList, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
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
              <button>Update</button>
              <button onClick={() => onDelete(order._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersTable;