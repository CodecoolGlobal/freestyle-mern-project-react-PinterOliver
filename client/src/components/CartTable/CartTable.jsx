import React from 'react';
import './CartTable.css';

function CartTable({ cart, onUpdate }) {
  return cart ? (
    <table style={{ height: 'fit-content' }}>
      <thead>
        <tr>
          <th className="titleColumn">Title</th>
          <th className="amtCol">Amount</th>
          <th className="priceCol">Unit Price</th>
          <th className="totPriceCol">Total Price</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((book) => (
          <tr key={book.id}>
            <td className="titleColumn">{book.title}</td>
            <td className="amtCol">
              <input
                type="number"
                min="1"
                value={book.amount}
                onChange={(e) => {
                  book.amount = e.target.value;
                  onUpdate(cart);
                }}
              />
            </td>
            <td className="priceCol">{book.price.toLocaleString('hu')} HUF</td>
            <td className="totPriceCol">{(book.price * book.amount).toLocaleString('hu')} HUF</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th>Summary</th>
          <td className="amtCol"></td>
          <td className="priceCol"></td>
          <td className="totPriceCol">
            {cart.reduce((acc, cv) => (acc += Number(cv.amount) * Number(cv.price)), 0)} HUF
          </td>
        </tr>
      </tfoot>
    </table>
  ) : (
    <div>404 Not found</div>
  );
}

export default CartTable;
