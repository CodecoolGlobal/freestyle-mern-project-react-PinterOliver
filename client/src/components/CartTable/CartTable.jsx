import React from 'react';

function CartTable({ cart }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((book) => (
          <tr>
            <td>{book.title}</td>
            <td>{book.amount}</td>
            <td>{book.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CartTable;
