import React from 'react';
import './OrderItemsTable.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function OrderItemsTable({ orderList, onDelete }) {
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
              <button>Update</button>
              <button onClick={() => onDelete(order._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderItemsTable;