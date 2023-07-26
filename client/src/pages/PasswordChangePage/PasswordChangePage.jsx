import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./PasswordChangePage.css";

function PasswordResetPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState();
  const { id, security } = useParams();

  const handleSubmit = (event) => {
    let status = 0;
    event.preventDefault();
    setShowError(false);
    setShowMessage(false);
    fetch(`/api/user/changepassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, _security: security, _password: password }),
    })
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((res) =>
        status === 200
          ? (setMessage(res.message), setShowMessage(true))
          : (setShowError(true), console.log(status)),
      );
  };

  return (
    <div className="outerContainer">
      <div className="loginFormContainer">
        <img className="logo" src={"../../../logo.png"} alt="logo" />
        <hr />
        <form className="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="password">
            New password:
            <input
              id="password"
              name="password"
              required
              className="formInput"
              type="password"
              value={password}
              pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\!\@\#\$\%\^\&\*\(\)])[A-Za-z\d\!\@\#\$\%\^\&\*\(\)]{8,}'
              // eslint-disable-next-line max-len
              title='Minimum 8 characters, at least 1 lowercase letter, uppercase letter, number, special character'
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label htmlFor="confirmPassword">
            Confirm password:
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="formInput"
              type="password"
              value={confirmPassword}
              required
              pattern={password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} // Escape special characters
              title="Passwords do not match"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {showError ? <div className="errorMessage">Url expired</div> : null}
          {showMessage ? <div className="successMessage">{message}</div> : null}
          <br />
          <br />
          <button className="mainButton" type="submit">
            Change password
          </button>
        </form>
        <hr />
      </div>
    </div>
  );
}

export default PasswordResetPage;
