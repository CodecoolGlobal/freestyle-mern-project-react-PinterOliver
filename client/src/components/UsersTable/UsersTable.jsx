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
            <td>{user.role.name}</td>
            <td>{user.email}</td>
            <td>{
              user.delivery?.country} {user.delivery?.post_code} {user.delivery?.city} {user.delivery?.address}
            </td>
            <td>{user.telephone_number}</td>
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
