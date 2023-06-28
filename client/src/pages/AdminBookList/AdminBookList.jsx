import React, { useEffect, useState } from 'react';
import './AdminBookList.css';
import BooksTable from '../../components/BooksTable';

function AdminBookList() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('/api/books');
      const jsonData = await response.json();
      setBookList(jsonData.books);
    };
    fetchBooks();
  }, []);

  return <BooksTable bookList={bookList} />;
}

export default AdminBookList;
