import React, { useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router';

function AdminBookCreator() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (book) => {
    setLoading(true);
    await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify(book),
    });
    setLoading(false);
    navigate('/admin/books');
  };

  if (loading) return <Loading />;

  return <BookForm onCancel={() => navigate('/admin/books')} onSave={handleCreate} />;
}

export default AdminBookCreator;
