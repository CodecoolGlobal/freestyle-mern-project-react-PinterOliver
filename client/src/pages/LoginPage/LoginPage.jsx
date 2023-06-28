import React, { useState } from 'react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        <button className="button">Register</button>
        <button className="button">Continue as a guest</button>
      </div>
    </div>
  );
}

export default LoginPage;
