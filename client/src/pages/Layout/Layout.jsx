import React from 'react';
import './Layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await fetch('/api/login', {
        method: 'DELETE',
        headers: {token: localStorage.getItem('token')},
      });
      localStorage.removeItem('token');
      localStorage.removeItem('cartid');
      localStorage.removeItem('cart');
      navigate('/');
    }
  };

  if (!localStorage.getItem('token')) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="Layout">
      <div className="main-navbar">
        <a className="main-logo" href="/">
          <img className="main-logo" src="/icon.png" alt="main logo"></img>
        </a>
        <a className='topButton' href="/books">
          <NavbarButton text='Books'/>
        </a>
        <a className='topButton' href="/admin">
          <NavbarButton text='Admin'/>
        </a>
        <a className='topButton' href="/cart">
          <NavbarButton text='Cart'/>
        </a>
        <a className='topButton' href='/presentation'>
          <NavbarButton text='Presentation'/>
        </a>
        <NavbarButton onClick={() => handleLogout()} text='Logout'/>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
