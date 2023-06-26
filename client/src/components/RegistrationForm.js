import React from 'react';
import './style.css';

function RegistrationForm() {
  return (
    <div className="form">
      <div className="form-body">
        <div className="userName">
          <label className="form__label" htmlFor="userName">Username </label>
          <input className="form__input" type="text" id="userName" placeholder="Username"/>
        </div>
        <div className="firstName">
          <label className="form__label" htmlFor="firstName">First Name </label>
          <input  type="text" name="" id="firstName"  className="form__input"placeholder="Firstname"/>
        </div>
        <div className="lastName">
          <label className="form__label" htmlFor="lastName">Last Name </label>
          <input  type="text" name="" id="lastName"  className="form__input"placeholder="Lastname"/>
        </div>
        <div className="email">
          <label className="form__label" htmlFor="email">Email </label>
          <input  type="email" id="email" className="form__input" placeholder="Email"/>
        </div>
        <div className="password">
          <label className="form__label" htmlFor="password">Password </label>
          <input className="form__input" type="password"  id="password" placeholder="Password"/>
        </div>
        <div className="confirm-password">
          <label className="form__label" htmlFor="confirmPassword">Confirm Password </label>
          <input className="form__input" type="password" id="confirmPassword" placeholder="Confirm Password"/>
        </div>
      </div>
      <div className="registerSubmit">
        <button type="submit" className="btn">Register</button>
      </div>
    </div>
  );
}
export default RegistrationForm;
