import React, { useEffect, useRef, useState } from 'react';
import './Layout.css';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import ChatBox from '../../components/ChatBox/ChatBox';

function Layout() {
  const navigate = useNavigate();
  const [chatContent, setChatContent] = useState([]);
  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = webSocket.current ?? new WebSocket('ws://localhost:3000/chat');
  }, []);

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      if (message.type === 'clientIdRequest') {
        webSocket.current.send(
          JSON.stringify({ type: 'clientIdPost', content: localStorage.getItem('token') })
        );
      }
      if (message.type === 'newMessage') {
        const nextChatContent = [message.content, ...chatContent];
        setChatContent(nextChatContent);
      }
    };
  }, [chatContent]);

  const handleChatSend = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify({ text: message }),
    });
    const newMessage = (await response.json()).message;

    webSocket.current.send(JSON.stringify({ type: 'newMessage', content: newMessage }));
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await fetch('/api/login', {
        method: 'DELETE',
        headers: { token: localStorage.getItem('token') },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('cartid');
      localStorage.removeItem('cart');
      localStorage.removeItem('clientId');
      navigate('/');
    }
  };

  if (!localStorage.getItem('token')) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="Layout">
      <div className="main-navbar">
        <a className="main-logo" href="/">
          <img className="main-logo" src="/icon.png" alt="main logo"></img>
        </a>
        <Link to={'/books'}>
          {' '}
          <NavbarButton text="Books" />
        </Link>
        <Link to={'/admin'}>
          {' '}
          <NavbarButton text="Admin" />
        </Link>
        <Link to={'/cart'}>
          {' '}
          <NavbarButton text="Cart" />
        </Link>{' '}
        <Link to={'/presentation'}>
          {' '}
          <NavbarButton text="Presentation" />
        </Link>
        <NavbarButton onClick={() => handleLogout()} text="Logout" />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <div className="floatingChatBox">
        <ChatBox onSend={handleChatSend} content={chatContent} />
      </div>
    </div>
  );
}

export default Layout;
