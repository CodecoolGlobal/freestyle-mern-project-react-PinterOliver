import React, { useState } from 'react';

function OrderHeaderForm({ order, onCancel, onSave }) {
  const [state, setState] = useState(order?.state ?? '');

  const onSubmit = () => {
    if (order) {
      onSave({
        ...order,
        state,
      });
    }

    onSave({
      state,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="state">State:</label>
        <select value={state} onChange={(e) => setState(e.target.value)} name="state" id="state">
          <option value="cart">Cart</option>
          <option value="placed">Orderd</option>
          <option value="order_confirmed">Order confirmed</option>
          <option value="transferred_to_shipping">Transferred to shipping</option>
          <option value="order_completed">Completed</option>
        </select>  
        {/* <input value={state} onChange={(e) => setState(e.target.value)} name="state" id="state" /> */}
      </div>

      <div className="buttons">
        <button type="submit">{order ? 'Update order state' : 'Don\t have any orders'}</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default OrderHeaderForm;
