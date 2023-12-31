import React, { useEffect, useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router';
import { fetchPostOneBook } from '../../controllers/fetchBooksController';

function AdminBookCreator() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('canModifyItems')) navigate('/admin');
  }, []);

  const handleCreate = async (book) => {
    setLoading(true);
    await fetchPostOneBook(book);
    setLoading(false);
    navigate('/admin/books');
  };

  if (loading) return <Loading />;

  return <BookForm onCancel={() => navigate('/admin/books')} onSave={handleCreate} />;
}

export default AdminBookCreator;
