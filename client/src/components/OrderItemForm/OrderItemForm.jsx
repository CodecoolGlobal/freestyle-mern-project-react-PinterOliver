import React, { useState } from 'react';

function OrderItemForm({ order, onCancel, onSave }) {
  const [amount, setAmount] = useState(order?.amount ?? '');

  const onSubmit = () => {
    if (order) {
      onSave({
        ...order,
        amount,
      });
    }

    onSave({
      amount,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="amount">Amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          name="amount"
          id="amount"
        />
        {/* <select value={amount} onChange={(e) => setAmount(e.target.value)} name="state" id="state"> */}
        {/* <option value="cart">Cart</option>
          <option value="placed">Orderd</option>
          <option value="order_confirmed">Order confirmed</option>
          <option value="transferred_to_shipping">Transferred to shipping</option>
          <option value="order_completed">Completed</option>
        </select>   */}
        {/* <input value={state} onChange={(e) => setState(e.target.value)} name="state" id="state" /> */}
      </div>

      <div className="buttons">
        <button type="submit">{order ? 'Update book amount' : 'Don\t have any orders'}</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default OrderItemForm;
