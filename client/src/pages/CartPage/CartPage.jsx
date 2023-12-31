import React, { useState } from 'react';
import CartTable from '../../components/CartTable';
import './CartPage.css';
import { Link } from 'react-router-dom';
import {
  fetchPostOneOrderItem,
  fetchPatchOneOrderItem,
} from '../../controllers/fetchOrderItemsController';

function CartPage() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));

  const handleCartUpdate = async (newCart) => {
    setCart(structuredClone(newCart));
    const cartid = localStorage.getItem('cartid');
    localStorage.setItem('cart', JSON.stringify(newCart));
    const jsonItems = await Promise.all(
      newCart.map(async (item) => {
        const smallJSON = await fetchPostOneOrderItem(cartid, item);
        if (smallJSON.status !== 201) {
          if (smallJSON.rightMethod) {
            switch (smallJSON.rightMethod) {
            case 'PATCH':
              smallJSON.plus = await fetchPatchOneOrderItem(smallJSON.orderItem._id, item);
              break;
            }
          } else console.log(smallJSON.error);
        }
        return smallJSON;
      }),
    );
    console.log(jsonItems);
  };

  return (
    <div className="containingContainer">
      <div className="cartItemsContainer">
        <h1 className="pageTitle">Cart</h1>
        <hr />
        <div className="tableContent">
          <CartTable cart={cart} onUpdate={handleCartUpdate} />
        </div>
        <hr />
        <div>
          <Link to="/cart/address">
            <button className="button">next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
