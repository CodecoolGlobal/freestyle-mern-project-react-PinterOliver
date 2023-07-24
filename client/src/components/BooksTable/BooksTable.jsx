import React, { useState } from 'react';
import './BooksTable.css';
import { useNavigate } from 'react-router';

function BooksTable({ bookList, onDelete }) {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState('');

  return (
    <table>
      <thead>
        <tr>
          <th className="titleCol">Title</th>
          <th className="authCol">Author</th>
          <th className="priceCol">Price</th>
          <th className="btnCol"></th>
        </tr>
      </thead>
      <tbody>
        {bookList.map((book) => (
          <tr key={book._id}>
            <td className="titleCol">{book.title}</td>
            <td className="authCol">{book.author}</td>
            <td className="priceCol">{book.price.toLocaleString('hu')}</td>
            <td className="btnCol">
              {expandedRow === book._id ? (
                <>
                  <button onClick={() => navigate(`update/${book._id}`)}>Update</button>
                  <button onClick={() => onDelete(book._id)}>Delete</button>
                  <button onClick={() => setExpandedRow('')}>-</button>
                </>
              ) : (
                <>
                  <button onClick={() => setExpandedRow(book._id)}>+</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BooksTable;
