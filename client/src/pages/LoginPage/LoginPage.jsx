import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    deleteCache();
    const response = await fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const jsonData = await response.json();
    console.log(jsonData);

    if (jsonData.token) {
      localStorage.setItem('token', jsonData.token);
      loadExistingCart(jsonData.token);
      const resData = await fetch('/api/orderheaders/cart', {
        headers: {token: jsonData.token},
      });
      const jsonDataPlus = await resData.json();
      if (resData.status === 200) {
        const id = jsonDataPlus.orderheader._id;
        localStorage.setItem('cartid', id);
      } else {
        console.log(jsonDataPlus);
      }
      navigate('/');
    } else {
      console.log(jsonData.error);
    }

  };

  return (
    <div className='outerContainer'>
      <div className="loginFormContainer">
        <img className="logo" src={'logo.png'} alt="logo" />
        <hr/>
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
        <hr/>
        <div>
          <button className="button">Forgot Password</button>
          <a href='/register'>
            <button className="button">Register</button>
          </a>
        </div>
        <Link to='/books'>
          <button className="button">Continue as a guest</button>
        </Link>
      </div>
    </div>
  );
}

async function loadExistingCart(token) {
  const response = await fetch('/api/orderheaders/cart', {
    headers: {
      token: token,
    },
  });

  let cartOrderId;
  if (response.status === 200) {
    const jsonData = await response.json();
    cartOrderId = jsonData.orderheader._id;
  }
  if (response.status === 204) {
    const newHeadRes = await fetch('/api/orderheaders', {
      method: 'POST',
      headers: {
        token: token,
      },
    });
    const jsonData = await newHeadRes.json();
    cartOrderId = jsonData.orderheader._id;
  }

  const cartItemsRes = await fetch(`/api/orderitems/orderheaders/${cartOrderId}`, {
    headers: {
      token: token,
    },
  });
  const items = (await cartItemsRes.json()).orderitems ?? [];
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

async function deleteCache() {
  if (localStorage.getItem('token')) {
    await fetch('/api/login', {
      method: 'DELETE',
      headers: {token: localStorage.getItem('token')},
    });
  }
  localStorage.removeItem('token');
  localStorage.removeItem('cartid');
  localStorage.removeItem('cart');
}

export default LoginPage;
