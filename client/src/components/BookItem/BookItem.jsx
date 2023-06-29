import { useState } from 'react';
import './BookItem.css';

const BookItem = ({ book }) => {
  function checkLocalStorageCart() {
    const cart = localStorage.getItem('cart');
    const hasCart = cart !== null && cart !== undefined;
    if (hasCart) {
      addToCart(book);
    } else {
      const newCart = [
        {
          id: book._id,
          title: book.title,
          price: book.price,
          amount: 1,
        },
      ];
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }

  function addToCart(book) {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    const foundItem = storedCart.find((item) => item.id === book._id);

    if (foundItem) {
      foundItem.amount++;
    } else {
      storedCart.push({
        id: book._id,
        title: book.title,
        price: book.price,
        amount: 1,
      });
    }
    localStorage.setItem('cart', JSON.stringify(storedCart));
  }

  const maxLength = 20;
  const limitedTitle =
    book.title.length > maxLength ? `${book.title.substring(0, maxLength)}...` : book.title;

  return (
    <div className="itemsContainer" key={book._id}>
      <div className="bookContainer">
        <img className="bookThumbnail" src={book?.image_url} />
        <a href={`http://localhost:3000/books/${book._id}`}>
          <h2 className="bookTitle">{limitedTitle}</h2>
        </a>
        <p className="bookPrice">{book.price}€</p>
        <button onClick={() => checkLocalStorageCart()}>Add to cart</button>
      </div>
    </div>
  );
};

export default BookItem;
