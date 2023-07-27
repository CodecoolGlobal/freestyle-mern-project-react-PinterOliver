import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Layout from './pages/Layout';
import BookPage from './pages/BookPage/BookPage';
import ItemPage from './pages/ItemPage/ItemPage';
import AdminPage from './pages/AdminPage';
import AdminBookList from './pages/AdminBookList';
import AdminUserList from './pages/AdminUserList';
import LoginPage from './pages/LoginPage';
import AdminBookUpdater from './pages/AdminBookUpdater';
import AdminBookCreator from './pages/AdminBookCreator';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CartPage from './pages/CartPage';
import AdminOrderList from './pages/AdminOrderList';
import AdminOrderUpdater from './pages/AdminOrderUpdater';
import Presentation from './pages/Presentation/Presentation';
import PasswordResetPage from './pages/PasswordResetPage/PasswordResetPage';
import PasswordChangePage from './pages/PasswordChangePage/PasswordChangePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'books',
        element: <BookPage />,
      },
      {
        path: 'books/:id',
        element: <ItemPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
        children: [
          {
            path: 'books',
            element: <AdminBookList />,
          },
          {
            path: 'books/create',
            element: <AdminBookCreator />,
          },
          {
            path: 'books/update/:id',
            element: <AdminBookUpdater />,
          },
          {
            path: 'users',
            element: <AdminUserList />,
          },
          {
            path: 'orders',
            element: <AdminOrderList />,
          },
          {
            path: 'orders/update/:id',
            element: <AdminOrderUpdater />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'resetpassword',
    element: <PasswordResetPage />,
  },
  {
    path: 'changepassword/:id/:security',
    element:  <PasswordChangePage/>,
  },
  {
    path: 'Register',
    element: <RegisterPage />,
  },
  {
    path: 'presentation',
    element: <Presentation />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

reportWebVitals();
