import { useState, useEffect } from 'react';
import BookItem from '../components/BookItem/BookItem';
import BookFilter from '../components/BookFilter/BookFilter';

const BookPage = () => {
const [books, setBooks] = useState();

useEffect(() => {
  fetch('http://localhost:8080/api/books')
  .then(res => res.json())
  .then(data => {
    console.log(data)
    setBooks(data);
  })
}, []);


  return (
    <div>
{/*       <BookFilter/> */}
{books && books.length > 0 ? (
        books.map(book => <BookItem key={book.id} book={book} />)
      ) : (
        <p>No books found.</p>
      )}
      
    </div>
  )
}

export default BookPage