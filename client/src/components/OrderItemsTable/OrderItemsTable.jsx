import React, { useState } from 'react';
import './OrderItemsTable.css';

function OrderItemsTable({ orderList, onLearnLess, onDelete, onGoBack }) {
  const [expandedRow, setExpandedRow] = useState('');

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="titleCol">Title</th>
            <th className="authCol">Author</th>
            <th className="amountCol">Amount</th>
            <th className="priceCol">Price</th>
            <th className="totPriceCol">Total price</th>
            <th className="btnCol"></th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order._id}>
              <td className="titleCol">{order.item.title}</td>
              <td className="authCol">{order.item.author}</td>
              <td className="amountCol">{order.amount}</td>
              <td className="priceCol">{order.bookPrice.toLocaleString('hu')}</td>
              <td className="totPriceCol">{order.price.toLocaleString('hu')}</td>
              <td className="btnCol">
                {expandedRow === order._id ? (
                  <>
                    <button onClick={() => onDelete(order._id)}>Delete item</button>
                    <button onClick={() => onLearnLess(order._id)}>Update order</button>
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
      <button onClick={() => onGoBack()}>Back</button>
    </>
  );
}

export default OrderItemsTable;
