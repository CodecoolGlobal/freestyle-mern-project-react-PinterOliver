import React, { useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router';
import { fetchPostBooks } from '../../controllers/fetchController';

function AdminBookCreator() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (book) => {
    setLoading(true);
    await fetchPostBooks(book);
    setLoading(false);
    navigate('/admin/books');
  };

  if (loading) return <Loading />;

  return <BookForm onCancel={() => navigate('/admin/books')} onSave={handleCreate} />;
}

export default AdminBookCreator;
