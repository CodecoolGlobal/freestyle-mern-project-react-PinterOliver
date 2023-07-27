import React, { useEffect, useState } from 'react';
import './AdminUserList.css';
import Loading from '../../components/Loading';
import UsersTable from '../../components/UsersTable';
import { fetchGetUsers, fetchDeleteOneUser } from '../../controllers/fetchUsersController';

function AdminUserList() {
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    const response = await fetchGetUsers();
    setUserList(response.users ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetchDeleteOneUser(id);
    console.log(response);
    setUserList(userList.filter((user) => user._id !== id));
  };

  if (loading) return <Loading />;

  return <UsersTable userList={userList} onDelete={handleDelete} />;
}

export default AdminUserList;
