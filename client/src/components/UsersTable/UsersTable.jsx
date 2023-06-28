import React from 'react';
import './UsersTable.css';

function UsersTable({ userList, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Delivery address</th>
          <th>Tel. Num.</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {userList.map((user) => (
          <tr key={user._id}>
            <td>{user.userName}</td>
            <td>{user.name.first}</td>
            <td>{user.name.last}</td>
            <td>
              <button>Update</button>
              <button onClick={() => onDelete(user._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
