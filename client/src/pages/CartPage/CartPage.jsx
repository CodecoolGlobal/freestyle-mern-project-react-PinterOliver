import React, { useState } from 'react';
import CartTable from '../../components/CartTable';

function CartPage() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));

  const handleCartUpdate = async (newCart) => {
    setCart(structuredClone(newCart));
    const cartid = localStorage.getItem('cartid');
    const token = localStorage.getItem('token');
    localStorage.setItem('cart', JSON.stringify(newCart));
    const jsonItems = await Promise.all(newCart.map(async (item) => {
      const smallData = await fetch(`/api/orderitems/orderheaders/${cartid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          bookid: item.id,
          amount: Number(item.amount),
        }),
      });
      const smallJSON = await smallData.json();
      if (smallData.status !== 201) {
        if (smallJSON.rightMethod) {
          const otherData = await fetch(`/api/orderitems/${smallJSON.orderItem._id}`, {
            method: smallJSON.rightMethod,
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              bookid: item.id,
              amount: Number(item.amount),
            }),
          });
          const otherJSON = await otherData.json();
          smallJSON.plus = otherJSON;
        } else console.log(smallJSON.error);
      }
      return smallJSON;
    }));
    console.log(jsonItems);
  };

  return <CartTable cart={cart} onUpdate={handleCartUpdate} />;
}

export default CartPage;
