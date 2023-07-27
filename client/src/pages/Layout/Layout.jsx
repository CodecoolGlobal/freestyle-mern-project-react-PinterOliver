import React, { useEffect, useRef, useState } from 'react';
import './Layout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import NavbarButton from '../../components/NavbarButton/NavbarButton';
import ChatBox from '../../components/ChatBox/ChatBox';
import { fetchGetOneLogin, fetchDeleteOneLogin } from '../../controllers/fetchLoginController';

const removeEverythingFromStorage = () => {
  localStorage.removeItem('cartid');
  localStorage.removeItem('cart');
  localStorage.removeItem('canModifyItems');
  localStorage.removeItem('canViewAllOrders');
  localStorage.removeItem('canViewAllUsers');
  localStorage.removeItem('canModifyRoles');
  localStorage.removeItem('canAccessStorage');
};

const isNotGuest = async () => {
  const response = await fetchGetOneLogin();
  return response.success;
};

function Layout() {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(true);
  const [chatContent, setChatContent] = useState([]);
  const webSocket = useRef(null);

  useEffect(() => {
    isNotGuest()
      .then((response) => {
        if (response) setIsGuest(false);
        else setIsGuest(true);
      });
  }, []);

  useEffect(() => {
    webSocket.current = webSocket.current ?? new WebSocket('ws://localhost:3000/chat');

    webSocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      if (message.type === 'clientIdRequest') {
        fetchGetOneLogin()
          .then((response) => {
            const userId = response.id;
            webSocket.current.send(
              //deleted: content: localstorage.getItem('token')
              JSON.stringify({ type: 'clientIdPost', content: userId }),
            );
          });
      }
      if (message.type === 'newMessage') {
        const nextChatContent = [message.content, ...chatContent];
        setChatContent(nextChatContent);
      }
    };
  }, [chatContent]);

  //deleted token
  const handleChatSend = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        //deleted token: token
      },
      body: JSON.stringify({ text: message }),
    });
    const newMessage = (await response.json()).message;

    //webSocket.current.send(JSON.stringify({ type: 'newMessage', content: newMessage }));

    const waitForConnection = (callback, interval) => {
      if (webSocket.readyState === 1) {
        callback();
      } else {
        setTimeout(() => {
          waitForConnection(callback, interval);
        }, interval);
      }
    };

    const send = (messageToSend) => {
      waitForConnection( () => {
        webSocket.current.send(messageToSend);
      }, 1000);
    };

    send(JSON.stringify({ type: 'newMessage', content: newMessage }));

  };

  const handleLogout = async () => {
    if (isGuest || window.confirm('Are you sure you want to log out?')) {
      await fetchDeleteOneLogin();
      removeEverythingFromStorage();
      navigate('/login');
    }
  };

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
        <NavbarButton
          onClick={() => handleLogout()}
          text={isGuest ? 'Login' : 'Logout'}
        />
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
