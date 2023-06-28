import React from 'react';
import './AdminPage.css';
import { Outlet } from 'react-router';

function AdminPage() {
  return (
    <>
      <div className="sidebarContainer">
        <nav className="side-menu">
          <ul>
            <li>Books</li>
            <li>Orders</li>
            <li>Users</li>
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
