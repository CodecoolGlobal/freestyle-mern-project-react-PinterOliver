import React, { useEffect, useState } from 'react';
import BookForm from '../../components/BookForm/BookForm';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';

function AdminBookUpdater() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const response = await fetch(`/api/books/${id}`);
      const jsonData = await response.json();
      setBook(jsonData.book);
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  const handleSave = async (book) => {
    setLoading(true);
    await fetch(`/api/books/${id}`, {
      method: 'PATCH',
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

  return <BookForm book={book} onCancel={() => navigate('/admin/books')} onSave={handleSave} />;
}

export default AdminBookUpdater;
