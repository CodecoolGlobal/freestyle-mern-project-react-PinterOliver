import React, { useEffect, useRef, useState } from 'react';
import './Layout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import ChatBox from '../../components/ChatBox/ChatBox';
import { fetchGetOneLogin, fetchDeleteOneLogin } from '../../controllers/fetchLoginController';
import Loading from '../../components/Loading';

const removeEverythingFromStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('cartid');
  localStorage.removeItem('cart');
  localStorage.removeItem('canModifyItems');
  localStorage.removeItem('canViewAllOrders');
  localStorage.removeItem('canViewAllUsers');
  localStorage.removeItem('canModifyRoles');
  localStorage.removeItem('canAccessStorage');
};

const isNotGuest = () => {
  return localStorage.getItem('token') && localStorage.getItem('token') !== 'guest';
};

function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chatContent, setChatContent] = useState([]);
  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = webSocket.current ?? new WebSocket('ws://localhost:3000/chat');

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

  const handleChatSend = async (message, token) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        token: token,
      },
      body: JSON.stringify({ text: message }),
    });
    const newMessage = (await response.json()).message;

    webSocket.current.send(JSON.stringify({ type: 'newMessage', content: newMessage }));
  };

  const handleLogout = async () => {
    if (!isNotGuest() || window.confirm('Are you sure you want to log out?')) {
      await fetchDeleteOneLogin();
      removeEverythingFromStorage();
      navigate('/login');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGetOneLogin().then((response) => {
      const token = localStorage.getItem('token');
      if (!token || (token !== 'guest' && !response?.success)) {
        removeEverythingFromStorage();
        setLoading(false);
        navigate('/login');
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
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
        <NavbarButton onClick={() => handleLogout()} text={isNotGuest() ? 'Logout' : 'Login'} />
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
