import React from 'react';
import './OrderHeadersTable.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function OrderHeadersTable({ orderList, onLearnMore }) {
  console.log(orderList)
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
              <button onClick={() => onLearnMore(order._id)}>Learn more</button>
              {/* <button onClick={() => onDelete(order._id)}>Delete</button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderHeadersTable;