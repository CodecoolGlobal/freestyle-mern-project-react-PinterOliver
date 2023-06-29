import React, { useEffect, useState } from 'react';
import './AdminUserList.css';
import Loading from '../../components/Loading';
import UsersTable from '../../components/UsersTable';

function AdminUserList() {
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {headers: {
        token: localStorage.getItem('token'),
      }});
      const jsonData = await response.json();
      console.log(jsonData);
      setUserList(jsonData.users ?? []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    console.log(await response.json());
    setUserList(userList.filter((user) => user._id !== id));
  };

  if (loading) return <Loading />;

  return <UsersTable userList={userList} onDelete={handleDelete} />;
}

export default AdminUserList;
