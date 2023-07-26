import React, { useState } from 'react';
import './ChatBox.css';

function ChatBox({ onSend, content }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <textarea defaultValue={content} />
      <div>
        <input type="text" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={() => onSend(inputValue)}>Send</button>
      </div>
    </>
  );
}

export default ChatBox;
