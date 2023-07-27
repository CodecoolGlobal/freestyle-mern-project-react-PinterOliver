import React, { useEffect, useState } from 'react';
import './Layout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import { fetchGetOneLogin, fetchDeleteOneLogin } from '../../controllers/fetchLoginController';
import Loading from '../../components/Loading';

const removeEverythingFromStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('cartid');
  localStorage.removeItem('cart');
  localStorage.removeItem('canModifyItems');
  localStorage.removeItem('canViewAllOrders');
  localStorage.removeItem('canViewAllUsers');
  localStorage.removeItem('canModifyRoles');
  localStorage.removeItem('canAccessStorage');
};

const isNotGuest = () => {
  return localStorage.getItem('token') && localStorage.getItem('token') !== 'guest';
};

function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    if (!isNotGuest() || window.confirm('Are you sure you want to log out?')) {
      await fetchDeleteOneLogin();
      removeEverythingFromStorage();
      navigate('/login');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGetOneLogin()
      .then((response) => {
        const token = localStorage.getItem('token');
        if (!token || (token !== 'guest' && !response?.success)) {
          removeEverythingFromStorage();
          setLoading(false);
          navigate('/login');
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
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
        <NavbarButton
          onClick={() => handleLogout()}
          text={isNotGuest() ? 'Logout' : 'Login'}
        />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
