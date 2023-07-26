import React, { useState } from 'react';
import './Layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import ChatBox from '../../components/ChatBox/ChatBox';

function Layout() {
  const navigate = useNavigate();
  const [chatContent, setChatContent] = useState('');
  const webSocket = new WebSocket('ws://localhost:3000/chat');

  webSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'clientId') {
      const existingId = localStorage.getItem('clientId');
      localStorage.setItem('clientId', existingId ?? message.content);
      webSocket.send(
        JSON.stringify({ type: 'clientId', content: localStorage.getItem('clientId') })
      );
    }
    if (message.type === 'message') {
      console.log(message.content);
      setChatContent(`${chatContent}\n${message.content}`);
    }
  };

  const handleChatSend = (message) => {
    webSocket.send(
      JSON.stringify({
        type: 'chatMessage',
        content: {
          clientId: localStorage.getItem('clientId'),
          chatMessage: message,
          senderName: 'testName',
          dateTime: new Date().getTime(),
        },
      })
    );
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
        <a className="topButton" href="/books">
          <NavbarButton text="Books" />
        </a>
        <a className="topButton" href="/admin">
          <NavbarButton text="Admin" />
        </a>
        <a className="topButton" href="/cart">
          <NavbarButton text="Cart" />
        </a>
        <a className="topButton" href="/presentation">
          <NavbarButton text="Presentation" />
        </a>
        <NavbarButton onClick={() => handleLogout()} text="Logout" />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <div className="chatBoxContainer">
        <ChatBox onSend={handleChatSend} content={chatContent} />
      </div>
    </div>
  );
}

export default Layout;
