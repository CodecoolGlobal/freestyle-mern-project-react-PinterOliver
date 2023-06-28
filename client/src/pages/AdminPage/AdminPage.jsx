import React from 'react';
import './AdminPage.css';
import { Outlet, Link } from 'react-router-dom';

function AdminPage() {
  return (
    <>
      <div className="sidebarContainer">
        <nav className="side-menu">
          <ul>
            <li>
              <Link to="books">Books</Link>
            </li>
            <li>Orders</li>
            <li>
              <Link to="users">Users</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="pageContent">
        <Outlet />
      </div>
    </>
  );
}

export default AdminPage;
