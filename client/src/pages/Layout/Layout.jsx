import React, { useEffect, useState } from 'react';
import './Layout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import { fetchDeleteOneLogin, fetchGetOneLogin } from '../../controllers/fetchLoginController';

const removeEverythingFromStorage = () => {
  localStorage.removeItem('cartid');
  localStorage.removeItem('cart');
  localStorage.removeItem('canModifyItems');
  localStorage.removeItem('canViewAllOrders');
  localStorage.removeItem('canViewAllUsers');
  localStorage.removeItem('canModifyRoles');
  localStorage.removeItem('canAccessStorage');
};

const isNotGuest = async () => {
  const response = await fetchGetOneLogin();
  return response.success;
};

function Layout() {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    isNotGuest()
      .then((response) => {
        if (response) setIsGuest(false);
        else setIsGuest(true);
      });
  }, []);

  const handleLogout = async () => {
    if (isGuest || window.confirm('Are you sure you want to log out?')) {
      await fetchDeleteOneLogin();
      removeEverythingFromStorage();
      navigate('/login');
    }
  };

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
        <NavbarButton
          onClick={() => handleLogout()}
          text={isGuest ? 'Login' : 'Logout'}
        />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
