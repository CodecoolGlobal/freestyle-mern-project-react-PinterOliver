import React from 'react';
import './BooksTable.css';
import { useNavigate } from 'react-router';

function BooksTable({ bookList, onDelete }) {
  const navigate = useNavigate();

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookList.map((book) => (
          <tr key={book._id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.price}</td>
            <td>
              <button onClick={() => navigate(`update/${book._id}`)}>Update</button>
              <button onClick={() => onDelete(book._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BooksTable;
