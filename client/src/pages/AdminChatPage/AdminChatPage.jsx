import React, { useEffect, useState } from 'react';

function AdminChatPage() {
  const [activeUserList, setActiveUserList] = useState([]);

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
    <div>
      <select name="user" id="user-select">
        <option value="">Please select a user!</option>
        {activeUserList?.map((user) => (
          <option key={user._id} value={user.token[0]}>
            {user.userName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AdminChatPage;
