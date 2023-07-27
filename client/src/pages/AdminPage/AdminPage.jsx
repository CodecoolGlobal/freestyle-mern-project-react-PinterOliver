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
              <Link to="books" className="adminSideButton">
                <NavbarButton text="Books" />
              </Link>
            </div>
            <div>
              <a href="/admin/books/create" className="adminSideButton">
                <NavbarButton text="Add a book" />
              </a>
            </div>
            <div>
              <Link to="orders" className="adminSideButton">
                <NavbarButton text="Orders" />
              </Link>
            </div>
            <div>
              <Link to="users" className="adminSideButton">
                <NavbarButton text="Users" />
              </Link>
            </div>
            <div>
              <Link to="chat" className="adminSideButton">
                <NavbarButton text="Chat" />
              </Link>
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
