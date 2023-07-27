import React, { useEffect, useState } from 'react';
import './AdminBookList.css';
import BooksTable from '../../components/BooksTable';
import Loading from '../../components/Loading';
import { fetchGetBooks, fetchDeleteOneBook } from '../../controllers/fetchBooksController';
import { useNavigate } from 'react-router-dom';

function AdminBookList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('canModifyItems') && !localStorage.getItem('canAccessStorage')) {
      navigate('/admin');
    }
    fetchGetBooks()
      .then((jsonData) => {
        setBookList(jsonData.books);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const response = await fetchDeleteOneBook(id);
    console.log(response);
    setBookList(bookList.filter((book) => book._id !== id));
  };

  if (loading) return <Loading />;

  return <BooksTable bookList={bookList} onDelete={handleDelete} />;
}

export default AdminBookList;
