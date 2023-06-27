import React from 'react';
import './BookItem.css';

const BookItem = (props) => {
  return (
    <div className='bookContainer'>
      <img className="bookThumbnail" src={props.books.img}/>
      <h2 className="bookTitle">{props.books.title}</h2>
      <p className="bookPrice">{props.books.price}</p>
    </div>
  )
}

export default BookItem