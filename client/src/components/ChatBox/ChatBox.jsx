import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import ChatMessage from '../ChatMessage';

function ChatBox({ onSend, content }) {
  const [inputValue, setInputValue] = useState('');
  const [activeUserList, setActiveUserList] = useState([]);
  const [selectedUserToken, setSelectedUserToken] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/users?onlyActive=true', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      const jsonData = (await response.json()).users;
      setActiveUserList(jsonData);
    };
    getUsers();
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
        <button onClick={() => onSend(inputValue, localStorage.getItem('token'))}>Send</button>
      </div>

      {localStorage.getItem('canViewAllUsers') === 'true' ? (
        <select onChange={(e) => setSelectedUserToken(e.target.value)} name="user" id="user-select">
          <option value="">Please select a user!</option>
          {activeUserList?.map((user) => (
            <option key={user._id} value={user.token[0]}>
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
