import React from 'react';
import './Layout.css';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="Layout">
      <nav>
        <ul>
          <li>
            <img src="/logo.png" alt="main logo"></img>
          </li>
          <li className="grow">Books</li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>Cart</li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
