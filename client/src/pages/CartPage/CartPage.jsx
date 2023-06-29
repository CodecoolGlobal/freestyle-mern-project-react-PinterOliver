import React, { useState } from 'react';
import CartTable from '../../components/CartTable';

function CartPage() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));

  return <CartTable cart={cart} />;
}

export default CartPage;
