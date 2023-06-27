import { useState } from 'react';
import BookItem from '../components/BookItem/BookItem';
import BookFilter from '../components/BookFilter/BookFilter';

const BookPage = () => {
const [books, setBooks] = useState([{
  _id: 1,
  title: 'Harry Potter',
  author: 'J.K. Rowling',
  publishedYear: '1997',
  price: 9.99,
  description: '...',
  createdAt: '2023-06-26T19:40:35.763+00:00',
  img: 'https://www.shutterstock.com/shutterstock/photos/795305758/display_1500/stock-vector-open-book-vector-clipart-silhouette-symbol-icon-design-illustration-isolated-on-white-background-795305758.jpg'
}]);

/* fetch('/api/books')
.then(res => res.json())
.then(data => {
  console.log(data)
  setBooks(data);
}) */

  return (
    <div>
      <BookFilter/>
      <BookItem books={books[0]}/>
    </div>
  )
}

export default BookPage