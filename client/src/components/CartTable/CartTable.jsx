import React from 'react';

function CartTable({ cart, onUpdate }) {
  return (
    cart ? (
      <table style={{ height: 'fit-content'}}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Unit Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>
                <input
                  type="number"
                  min='1'
                  value={book.amount}
                  onChange={(e) => {
                    book.amount = e.target.value;
                    onUpdate(cart);
                  }}
                />
              </td>
              <td>{book.price}</td>
              <td>{book.price * book.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Summary</th>
            <td>{cart.reduce((acc, cv) => (acc += Number(cv.amount)), 0)}</td>
            <td>{cart.reduce((acc, cv) => (acc += Number(cv.price)), 0)}</td>
            <td>{cart.reduce((acc, cv) => (acc += Number(cv.amount) * Number(cv.price)), 0)}</td>
          </tr>
        </tfoot>
      </table>
    ) : (
      <div>404 Not found</div>
    )
  );
}

export default CartTable;
