import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import {
  fetchPostOneLogin,
  fetchDeleteOneLogin,
  fetchGetOneLogin,
} from '../../controllers/fetchLoginController';
import {
  fetchGetCartOrderHeader,
  fetchPostOneOrderHeader,
} from '../../controllers/fetchOrderHeadersController';
import { fetchGetOrderItems } from '../../controllers/fetchOrderItemsController';

const isNotGuest = async () => {
  const response = await fetchGetOneLogin();
  return response.success;
};

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    isNotGuest()
      .then((response) => {
        if (response) setIsGuest(false);
        else setIsGuest(true);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    deleteCache();
    const response = await fetchPostOneLogin(username, password);

    if (response?.success) {
      localStorage.setItem('canModifyItems', response.canModifyItems);
      localStorage.setItem('canViewAllOrders', response.canViewAllOrders);
      localStorage.setItem('canViewAllUsers', response.canViewAllUsers);
      localStorage.setItem('canModifyRoles', response.canModifyRoles);
      localStorage.setItem('canAccessStorage', response.canAccessStorage);
      loadExistingCart();
      const resData = await fetchGetCartOrderHeader();
      if (resData.status === 200) {
        const id = resData.orderheader._id;
        localStorage.setItem('cartid', id);
      } else {
        console.log(resData);
      }
      navigate('/');
    } else {
      console.log(response.error);
    }
  };

  const handleGuestClick = () => {
    navigate('/books');
  };

  async function deleteCache() {
    if (!isGuest) {
      await fetchDeleteOneLogin();
    }
    localStorage.removeItem('cartid');
    localStorage.removeItem('cart');
  }

  return (
    <div className="outerContainer">
      <div className="loginFormContainer">
        <img className="logo" src={'logo.png'} alt="logo" />
        <hr />
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              className="formInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              className="formInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button className="mainButton" type="submit">
            Login
          </button>
        </form>
        <hr />
        <div>
          <Link to="/resetpassword">
            <button className="button">Forgot Password</button>
          </Link>
          <a href="/register">
            <button className="button">Register</button>
          </a>
        </div>
        <button className="button" onClick={handleGuestClick}>
            Continue as a guest
        </button>
      </div>
    </div>
  );
}

async function loadExistingCart() {
  const response = await fetchGetCartOrderHeader();

  let cartOrderId;
  if (response.status === 200) {
    cartOrderId = response.orderheader._id;
  }
  if (response.status === 204) {
    const newHeadRes = await fetchPostOneOrderHeader();
    cartOrderId = newHeadRes.orderheader._id;
  }

  const cartItemsRes = await fetchGetOrderItems(cartOrderId);
  const items = cartItemsRes?.orderitems ?? [];
  localStorage.setItem(
    'cart',
    JSON.stringify(
      items.map((order) => {
        return {
          id: order.item._id,
          title: order.item.title,
          amount: order.amount,
          price: order.price,
        };
      }),
    ),
  );
}

export default LoginPage;
