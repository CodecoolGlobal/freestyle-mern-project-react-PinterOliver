import React from 'react';
import './OrderItemsTable.css';

function OrderItemsTable({ orderList, onLearnLess, onDelete, onGoBack }) {
  return (
    <div>

      <table>
        <thead>
          <tr>
            <th>Amount of the book</th>
            <th>Price of the book</th>
            <th>Total price of the book(s)</th>
            <th>Author of the book</th>
            <th>Title of the book</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order._id}>
              <td>{order.amount}</td>
              <td>{order.bookPrice}</td>
              <td>{order.price}</td>
              <td>{order.item.author}</td>
              <td>{order.item.title}</td>
              <td>
                <button onClick={() => onLearnLess(order._id)}>Learn less</button>
              </td>
              <td>
                <button onClick={() => onDelete(order._id)}>Delete item</button>
              </td>
              <td>
                <button onClick={() => onLearnLess(order._id)}>Update order</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => onGoBack()}>Back</button>
    </div>
  );
}

export default OrderItemsTable;
