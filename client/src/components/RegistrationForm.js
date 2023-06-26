import React, { useState } from 'react';
import './style.css';

function RegistrationForm() {

  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    if (id === 'userName') setUserName(value);
    if (id === 'firstName') setFirstName(value);
    if (id === 'lastName') setLastName(value);
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = () => {
    console.log(userName, firstName, lastName, email, password);
  };

  return (
    <div className="form">
      <div className="form-body">
        <div className="userName">
          <label className="register_label">Username </label>
          <input className="register_input" type="text" id="userName" placeholder="Username"
            value={userName} onChange={(e) => handleInputChange(e)}/>
        </div>
        <div className="firstName">
          <label className="register_label">First Name </label>
          <input className="register_input" type="text" id="firstName" placeholder="Firstname"
            value={firstName} onChange={(e) => handleInputChange(e)}/>
        </div>
        <div className="lastName">
          <label className="register_label">Last Name </label>
          <input className="register_input" type="text" id="lastName" placeholder="Lastname"
            value={lastName} onChange={(e) => handleInputChange(e)}/>
        </div>
        <div className="email">
          <label className="register_label">Email </label>
          <input className="register_input" type="email" id="email" placeholder="Email"
            value={email} onChange={(e) => handleInputChange(e)}/>
        </div>
        <div className="password">
          <label className="register_label">Password </label>
          <input className="register_input" type="password" id="password" placeholder="Password"
            value={password} onChange={(e) => handleInputChange(e)}/>
        </div>
      </div>
      <div className="registerSubmit">
        <button onClick={() => handleSubmit()} type="submit" className="btn">Register</button>
      </div>
    </div>
  );
}

export default RegistrationForm;
