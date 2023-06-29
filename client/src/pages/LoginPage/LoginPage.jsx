import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './LoginPage.css';

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
        <button className="button">Continue as a guest</button>
      </div>
    </div>
  );
}

export default LoginPage;
