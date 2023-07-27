import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import { Outlet, Link } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import { fetchGetOneLogin } from '../../controllers/fetchLoginController';

const isNotGuest = async () => {
  const response = await fetchGetOneLogin();
  return response.success;
};

function AdminPage() {
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    isNotGuest()
      .then((response) => {
        if (response) setIsGuest(false);
        else setIsGuest(true);
      });
  }, []);

  return (
    <>
      <div className="sidebarContainer">
        <nav className="side-menu">
          <div>
            <div>
              {localStorage.getItem('canModifyItems') || localStorage.getItem('canAccessStorage') ?
                (
                  <Link to="books" className='adminSideButton'>
                    <NavbarButton text='Books'/>
                  </Link>
                ) : ''}
            </div>
            <div>
              {localStorage.getItem('canModifyItems') ? (
                <Link to="books/create" className='adminSideButton'>
                  <NavbarButton text='Add a book'/>
                </Link>
              ) : ''}
            </div>
            <div>
              {!isGuest ? (
                <Link to="orders" className='adminSideButton'>
                  <NavbarButton text='Orders'/>
                </Link>
              ) : ''}
            </div>
            <div>
              {!isGuest ? (
                <Link to="users" className='adminSideButton'>
                  <NavbarButton text='Users'/>
                </Link>
              ) : ''}
            </div>
          </div>
        </nav>
      </div>
      <div className="pageContent">
        <Outlet />
      </div>
    </>
  );
}

export default AdminPage;
