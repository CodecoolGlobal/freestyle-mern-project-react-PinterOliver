import React, { useState } from 'react';
import './ChatBox.css';
import ChatMessage from '../ChatMessage';

function ChatBox({ onSend, content }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      {content.map((msg) => (
        <ChatMessage key={msg._id} messageData={msg} />
      ))}
      <div>
        <input type="text" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={() => onSend(inputValue)}>Send</button>
      </div>
    </>
  );
}

export default ChatBox;
