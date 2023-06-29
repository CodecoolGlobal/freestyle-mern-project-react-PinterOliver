import React from 'react';
import './OrderItemsTable.css';

function OrderItemsTable({ orderList, onLearnLess }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Amount of the book</th>
          <th>Price of the book</th>
          <th>Total price of the order</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order) => (
          <tr key={order._id}>
            <td>{order.amount}</td>
            <td>{order.bookPrice}</td>
            <td>{order.price}</td>
            <td>
              <button onClick={() => onLearnLess(order._id)}>Learn less</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderItemsTable;