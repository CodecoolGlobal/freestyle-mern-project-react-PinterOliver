import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      navigate('/');
    } else {
      console.log(jsonData.error);
    }
  };

  return (
    <div>
      <img className="logo" src={'logo.png'} alt="logo" />
      <div className="loginFormContainer">
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
        <button className="button">Forgot Password</button>
        <a href="/register">
          <button className="button">Register</button>
        </a>
        <button className="button">Continue as a guest</button>
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
      headers: {
        token: token,
      },
    });
    const jsonData = await newHeadRes.json();
    cartOrderId = jsonData._id;
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
      })
    )
  );
}

export default LoginPage;
