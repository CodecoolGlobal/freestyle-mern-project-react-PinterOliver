import React from 'react';
import './AdminPage.css';
import { Outlet, Link } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';

function AdminPage() {
  return (
    <>
      <div className="sidebarContainer">
        <nav className="side-menu">
          <div>
            <div>
              {localStorage.getItem('canModifyItems') ? (
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
              {localStorage.getItem('token') !== 'guest' ? (
                <Link to="orders" className='adminSideButton'>
                  <NavbarButton text='Orders'/>
                </Link>
              ) : ''}
            </div>
            <div>
              {localStorage.getItem('token') !== 'guest' ? (
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
