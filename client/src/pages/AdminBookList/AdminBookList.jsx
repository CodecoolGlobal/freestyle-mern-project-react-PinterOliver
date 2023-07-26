import React, { useEffect, useState } from 'react';
import './AdminBookList.css';
import BooksTable from '../../components/BooksTable';
import Loading from '../../components/Loading';
import { fetchGetBooks, fetchDeleteBooks } from '../../controllers/fetchController';

function AdminBookList() {
  const [loading, setLoading] = useState(true);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetchGetBooks()
      .then((jsonData) => {
        setBookList(jsonData.books);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const response = await fetchDeleteBooks(id);
    console.log(response);
    setBookList(bookList.filter((book) => book._id !== id));
  };

  if (loading) return <Loading />;

  return <BooksTable bookList={bookList} onDelete={handleDelete} />;
}

export default AdminBookList;
