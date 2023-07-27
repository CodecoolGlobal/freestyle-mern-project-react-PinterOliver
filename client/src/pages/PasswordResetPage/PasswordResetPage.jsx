import React, { useState } from 'react';
import './PasswordResetPage.css';
import {
  fetchGetOneUserByEmail,
  fetchPutOneUserSecurity,
} from '../../controllers/fetchUsersController';

function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowError(false);
    setShowMessage(false);
    fetchGetOneUserByEmail(email)
      .then((response) =>
        response.status === 200
          ? (fetchPutOneUserSecurity(response.id),
          setShowMessage(true))
          : setShowError(true),
      );
  };

  return (
    <div className="outerContainer">
      <div className="loginFormContainer">
        <img className="logo" src={'logo.png'} alt="logo" />
        <hr />
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            Enter email address:
            <input
              className="formInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {showError ? (
            <div className="errorMessage">email address not found</div>
          ) : null}
          {showMessage ? (
            <div className="emailSentMessage">recovery email sent</div>
          ) : null}
          <br />
          <br />
          <button className="mainButton" type="submit">
            Reset password
          </button>
        </form>
        <hr />
      </div>
    </div>
  );
}

export default PasswordResetPage;
