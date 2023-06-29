import React, { useState } from 'react';
import CartTable from '../../components/CartTable';

function CartPage() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));

  const handleCartUpdate = (newCart) => {
    setCart(structuredClone(newCart));
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return <CartTable cart={cart} onUpdate={handleCartUpdate} />;
}

export default CartPage;
