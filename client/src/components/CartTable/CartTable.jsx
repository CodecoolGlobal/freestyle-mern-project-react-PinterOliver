function CartTable({ cart, onUpdate }) {
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
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>
              <input
                type="number"
                value={book.amount}
                onChange={(e) => {
                  book.amount = e.target.value;
                  onUpdate(cart);
                }}
              />
            </td>
            <td>{book.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CartTable;
