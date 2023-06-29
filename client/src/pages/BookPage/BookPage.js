import React, { useState, useEffect } from 'react';
import BookItem from '../../components/BookItem/BookItem';
import BookFilter from '../../components/BookFilter/BookFilter';
import './BookPage.css';
import Loading from '../../components/Loading';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState('title,ascend');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/books?maxprice=${maxPrice}&sort=${sort}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setLoading(false);
      });
  }, [maxPrice, sort]);

  if (loading) return <Loading />;
  return (
    <div className="items">
      <BookFilter
        maxPrice={maxPrice}
        OnFilter={(value) => {
          setMaxPrice(value);
          setLoading(true);
        }}
        OnSort={(value) => setSort(value)}
      />
      {books?.map((book) => (
        <BookItem key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookPage;
