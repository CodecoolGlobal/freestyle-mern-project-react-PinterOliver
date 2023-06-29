import React from 'react';
import './Layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  if (!localStorage.getItem('token')) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="Layout">
      <div className="main-navbar">
        <img className="main-logo" src="/icon.png" alt="main logo"></img>
        <a href="/books">
          <button>Books</button>
        </a>
        <a href="/admin">
          <button>Admin</button>
        </a>
        <a href="/cart">
          <button>Cart</button>
        </a>
        <a href='/presentation'>
          <button>Presentation</button>
        </a>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
