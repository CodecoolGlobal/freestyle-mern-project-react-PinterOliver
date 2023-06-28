import React, { useEffect, useState } from 'react';
import './AdminBookList.css';
import BooksTable from '../../components/BooksTable';
import Loading from '../../components/Loading';

function AdminBookList() {
  const [loading, setLoading] = useState(true);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('/api/books');
      const jsonData = await response.json();
      setBookList(jsonData.books);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  if (loading) return <Loading />;

  return <BooksTable bookList={bookList} />;
}

export default AdminBookList;
