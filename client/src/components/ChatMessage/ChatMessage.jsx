import React from 'react';
import './ChatMessage.css';

function ChatMessage({ messageData }) {
  return <div>{messageData.text}</div>;
}

export default ChatMessage;
