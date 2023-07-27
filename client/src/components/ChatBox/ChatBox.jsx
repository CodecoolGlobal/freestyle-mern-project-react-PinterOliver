import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import ChatMessage from '../ChatMessage';
import { fetchGetOneLogin } from '../../controllers/fetchLoginController';

function ChatBox({ onSend, content }) {
  const [inputValue, setInputValue] = useState('');
  const [activeUserList, setActiveUserList] = useState([]);
  //const [selectedUserToken, setSelectedUserToken] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/users?onlyActive=true');
      const jsonData = (await response.json()).users;
      setActiveUserList(jsonData);
    };
    getUsers();
    fetchGetOneLogin()
      .then((response) => {
        setSelectedUserId(response.id);
      });
  }, []);

  return (
    <div className="chatBox">
      <div className="chatMessageList">
        {' '}
        {content.map((msg) => (
          <ChatMessage key={msg._id} messageData={msg} />
        ))}
      </div>

      <div className="chatInput">
        <input type="text" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={() => onSend(inputValue, selectedUserId)}>Send</button>
      </div>

      {localStorage.getItem('canViewAllUsers') === 'true' ? (
        <select onChange={(e) => setSelectedUserId(e.target.value)} name="user" id="user-select">
          <option value="">Please select a user!</option>
          {activeUserList?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.userName}
            </option>
          ))}
        </select>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ChatBox;
