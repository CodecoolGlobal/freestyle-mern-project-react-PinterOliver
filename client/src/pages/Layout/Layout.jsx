import React from 'react';
import './Layout.css';
import { Navigate, Outlet } from 'react-router-dom';

function Layout() {
  if (!Boolean(localStorage.getItem('token'))) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="Layout">
      <div className="main-navbar">
        <img className="main-logo" src="/logo.png" alt="main logo"></img>
        <a href="/books">
          <button>Books</button>
        </a>
        <a href="/admin">
          <button>Admin</button>
        </a>
        <a href="/cart">
          <button>Cart</button>
        </a>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
