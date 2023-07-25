import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router';

function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'userName') setUserName(value);
    if (id === 'firstName') setFirstName(value);
    if (id === 'lastName') setLastName(value);
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target);
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        name: { first: firstName, last: lastName },
        email,
        password,
      }),
    });
    const jsonData = await response.json();
    console.log(jsonData);
    if (response.status === 201) navigate('/');
  };

  return (
    <div>
      <a href="/login">
        <button>Back</button>
      </a>
      <h2>Register</h2>
      <form className="form" onSubmit={(event) => handleSubmit(event)}>
        <div className="form-body">
          <div className="userName">
            <label className="register_label">Username </label>
            <input
              className="register_input"
              type="text"
              id="userName"
              placeholder="Username"
              value={userName}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="firstName">
            <label className="register_label">First Name </label>
            <input
              className="register_input"
              type="text"
              id="firstName"
              placeholder="Firstname"
              value={firstName}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="lastName">
            <label className="register_label">Last Name </label>
            <input
              className="register_input"
              type="text"
              id="lastName"
              placeholder="Lastname"
              value={lastName}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="email">
            <label className="register_label">Email </label>
            <input
              className="register_input"
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="password">
            <label className="register_label">Password </label>
            <input
              className="register_input"
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleInputChange(e)}
              required
              autoComplete='off'
              pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\!\@\#\$\%\^\&\*\(\)])[A-Za-z\d\!\@\#\$\%\^\&\*\(\)]{8,}'
              // eslint-disable-next-line max-len
              title='Minimum 8 characters, at least 1 lowercase letter, uppercase letter, number, special character'
            />
          </div>
        </div>
        <div className="registerSubmit">
          <input
            type="submit"
            className="btn"
            value='Register'
          />
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
