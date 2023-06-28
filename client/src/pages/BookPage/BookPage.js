import { useState, useEffect } from "react";
import BookItem from "../../components/BookItem/BookItem";
import BookFilter from "../../components/BookFilter/BookFilter";
import './BookPage.css';

const BookPage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
      });
  }, []);

  return (
    <div className="items">
      <BookFilter />
      {books?.map((book) => (
        <BookItem book={book} />
      ))}
    </div>
  );
};

export default BookPage;
