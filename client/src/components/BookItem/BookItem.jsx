/* eslint-disable require-atomic-updates */
import React from 'react';
import './BookItem.css';

const BookItem = ({ book }) => {

  async function checkLocalStorageCart() {
    const cart = localStorage.getItem('cart');
    let cartid = localStorage.getItem('cartid');
    const token = localStorage.getItem('token');
    const hasCart = cart !== null && typeof cart !== 'undefined';
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
    const newCart = await JSON.parse(localStorage.getItem('cart'));
    if (!cartid) {
      const resHeader = await fetch('/api/orderheaders', {
        method: 'POST',
        headers: {token: token},
      });
      const jsonHeader = await resHeader.json();
      if (jsonHeader && jsonHeader.orderheader._id) {
        cartid = jsonHeader.orderheader._id;
        localStorage.setItem('cartid', cartid);
      }
    }
    const jsonItems = await Promise.all(newCart.map(async (item) => {
      const smallData = await fetch(`/api/orderitems/orderheaders/${cartid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          bookid: item.id,
          amount: item.amount,
        }),
      });
      const smallJSON = await smallData.json();
      if (smallData.status !== 201) {
        if (smallJSON.rightMethod) {
          const otherData = await fetch(`/api/orderitems/${smallJSON.orderItem._id}`, {
            method: smallJSON.rightMethod,
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              bookid: item.id,
              amount: item.amount,
            }),
          });
          const otherJSON = await otherData.json();
          smallJSON.plus = otherJSON;
        } else console.log(smallJSON.error);
      }
      return smallJSON;
    }));
    console.log(jsonItems);
  }

  function addToCart(bookData) {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    const foundItem = storedCart.find((item) => item.id === bookData._id);

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
        <p className="bookPrice">{book.price}HUF</p>
        <button onClick={() => checkLocalStorageCart()} className='cartButton'>Add to cart</button>
      </div>
    </div>
  );
};

export default BookItem;
