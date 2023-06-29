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
        <a className='topButton' href="/books">
          <button>Books</button>
        </a>
        <a className='topButton' href="/admin">
          <button>Admin</button>
        </a>
        <a className='topButton' href="/cart">
          <button>Cart</button>
        </a>
        <a className='topButton' href='/presentation'>
          <button>Presentation</button>
        </a>
        <button className='topButton' onClick={() => handleLogout()}>Logout</button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
