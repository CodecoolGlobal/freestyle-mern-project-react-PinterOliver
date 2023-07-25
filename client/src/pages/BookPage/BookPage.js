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
  const [page, setPage] = useState(1);
  const perpage = 24;

  useEffect(() => {
    fetch(`/api/books?maxprice=${maxPrice}&sort=${sort}&page=${page}&perpage=${perpage}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setLoading(false);
      });
  }, [maxPrice, sort, page, perpage]);

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    console.log(bottom);
    if (bottom) setPage(page + 1);
    console.log(page);
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="sidebarContainer">
        <BookFilter
          maxPrice={maxPrice}
          OnFilter={(value) => {
            setMaxPrice(value);
            setLoading(true);
          }}
          OnSort={(value) => setSort(value)}
        />
      </div>
      <div className="pageContent">
        <div className="gridWrapper">
          {books?.map((book) => (
            <BookItem key={book._id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookPage;
