import React, { useEffect, useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { fetchGetOneBook, fetchPatchOneBook } from '../../controllers/fetchBooksController';

function AdminBookUpdater() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchGetOneBook()
      .then((response) => {
        setBook(response.book);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    await fetchPatchOneBook(id, book);
    setLoading(false);
    navigate('/admin/books');
  };

  if (loading) return <Loading />;

  return <BookForm book={book} onCancel={() => navigate('/admin/books')} onSave={handleSave} />;
}

export default AdminBookUpdater;
