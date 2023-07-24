import React, { useState } from 'react';
import './UsersTable.css';

function UsersTable({ userList, onDelete }) {
  const [expandedRow, setExpandedRow] = useState('');

  return (
    <table>
      <thead>
        <tr>
          <th className="userNameCol">Username</th>
          <th className="firstNameCol">First Name</th>
          <th className="lastNameCol">Last Name</th>
          <th className="roleCol">Role</th>
          <th className="emailCol">Email</th>
          <th className="addrCol">Delivery address</th>
          <th className="telCol">Tel. Num.</th>
          <th className="btnCol"></th>
        </tr>
      </thead>
      <tbody>
        {userList.map((user) => (
          <tr key={user._id}>
            <td className="userNameCol">{user.userName}</td>
            <td className="firstNameCol">{user.name.first}</td>
            <td className="lastNameCol">{user.name.last}</td>
            <td className="roleCol">{user.role.name}</td>
            <td className="emailCol">{user.email}</td>
            <td className="addrCol multiline">
              {user.delivery?.country} {user.delivery?.post_code}
              <br />
              {user.delivery?.city}
              <br />
              {user.delivery?.address}
            </td>
            <td className="telCol">{user.telephone_number}</td>
            <td className="btnCol">
              {expandedRow === user._id ? (
                <>
                  <button>Update</button>
                  <button onClick={() => onDelete(user._id)}>Delete</button>
                  <button onClick={() => setExpandedRow('')}>-</button>
                </>
              ) : (
                <>
                  <button onClick={() => setExpandedRow(user._id)}>+</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
