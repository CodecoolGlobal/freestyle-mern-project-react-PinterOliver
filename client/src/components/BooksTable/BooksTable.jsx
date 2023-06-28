import React from 'react';
import './BooksTable.css';

function BooksTable({ bookList }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {bookList.map((book) => (
          <tr>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BooksTable;
