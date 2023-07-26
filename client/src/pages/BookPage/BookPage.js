import React, { useState, useEffect } from 'react';
import BookItem from '../../components/BookItem/BookItem';
import BookFilter from '../../components/BookFilter/BookFilter';
import './BookPage.css';
import Loading from '../../components/Loading';
import { fetchGetBooks } from '../../controllers/fetchController';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState('title,ascend');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [extraBooksLoading, setExtraBooksLoading] = useState(false);
  const [bottomOfPage, setBottomOfPage] = useState(false);
  const perpage = 20;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchGetBooks(maxPrice, sort, 1, perpage)
      .then((data) => {
        setBooks(data.books);
        setLoading(false);
      });
    console.log(page);
  }, [maxPrice, sort, perpage]);

  useEffect(() => {
    setExtraBooksLoading(true);
    fetchGetBooks(maxPrice, sort, page, perpage)
      .then((data) => {
        if (data.books.length > 0) setBooks([...books, ...data.books]);
        else setBottomOfPage(true);
        setExtraBooksLoading(false);
      });
    console.log(page);
  }, [page]);

  const handleScroll = (event) => {
    if (!bottomOfPage && !extraBooksLoading) {
      const bottom =
        event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight <= 1;
      if (bottom) setPage(page + 1);
    }
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
      <div className="pageContent" onScroll={handleScroll}>
        <div className="gridWrapper">
          {books?.map((book) => (
            <BookItem key={book._id} book={book} />
          ))}
        </div>
        {extraBooksLoading ? (
          <Loading />
        ) : ''}
      </div>
    </>
  );
};

export default BookPage;
