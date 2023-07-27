import React from 'react';
import './ChatMessage.css';

function ChatMessage({ messageData }) {
  const createDate = new Date(messageData.createdAt);

  return (
    <div>
      <div>{`[${String(createDate.getHours()).padStart(2, '0')}:${String(
        createDate.getMinutes()
      ).padStart(2, '0')}] ${messageData.senderName}:`}</div>
      <div>{messageData.text}</div>
    </div>
  );
}

export default ChatMessage;
