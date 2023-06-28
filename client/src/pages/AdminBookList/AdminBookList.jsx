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

  const handleDelete = async (id) => {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        token: localStorage.getItem('token'),
      },
    });
    console.log(await response.json());
    setBookList(bookList.filter((book) => book._id !== id));
  };

  if (loading) return <Loading />;

  return <BooksTable bookList={bookList} onDelete={handleDelete} />;
}

export default AdminBookList;
