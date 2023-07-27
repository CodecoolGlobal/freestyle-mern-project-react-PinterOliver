import React, { useState } from 'react';
import './PasswordResetPage.css';

function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (event) => {
    let status = 0;
    event.preventDefault();
    setShowError(false);
    setShowMessage(false);
    fetch(`/api/userid/${email}`)
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((res) =>
        status === 200
          ? (fetch(`/api/user/reset/${res.id}`, { method: 'PUT' }),
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
