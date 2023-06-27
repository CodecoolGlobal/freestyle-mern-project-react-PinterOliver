import React, { useState } from 'react';
import logo from '../logopng.png';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <img className='logo' src={logo}/>
      <div className="loginFormContainer">
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
        Username:
            <input className="formInput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
        Password:
            <input className="formInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button className="mainButton" type="submit">Login</button>
        </form>
        <button className="button">Forgot Password</button>
        <button className="button">Register</button>
        <button className="button">Continue as a guest</button>
      </div>
    </div>
  );
}

export default Login;
