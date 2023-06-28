import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './pages/Layout';
import BookPage from './pages/BookPage/BookPage';
import ItemPage from './pages/ItemPage/ItemPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: 'books',
      element: <BookPage />,
    },
    {
      path: 'books/:id',
      element: <ItemPage />,
    }],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
