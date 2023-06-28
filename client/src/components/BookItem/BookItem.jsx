import React from "react";
import "./BookItem.css";

const BookItem = (props) => {
  const maxLength = 20;
  const limitedTitle =
    props.book.title.length > maxLength
      ? `${props.book.title.substring(0, maxLength)}...`
      : props.book.title;

  return (
    <div className="itemsContainer" key={props.book._id}>
      <div className="bookContainer">
        <img className="bookThumbnail" src={props.book?.image_url} />
        <a href={`http://localhost:3000/books/${props.book._id}`}>
          <h2 className="bookTitle">{limitedTitle}</h2>
        </a>
        <p className="bookPrice">{props.book.price}€</p>
        <button>Add to cart</button>
      </div>
    </div>
  );
};

export default BookItem;
