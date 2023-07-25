import React, { useState, useEffect } from 'react';
import './ItemPage.css';
import ItemPageItem from '../../components/ItemPageItem';

const ItemPage = () => {
  const path = window.location.pathname;
  const id = path.substring(path.lastIndexOf('/') + 1);

  const [book, setBook] = useState([]);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data.book);
        console.log(data);
      });
  }, []);

  function checkLocalStorageCart() {
    const cart = localStorage.getItem('cart');
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

  return (
    <div>
      <div className="itemContainer">{book && book ? <ItemPageItem book={book} /> : null}</div>
      <a href={'http://localhost:3000/books'}>
        <button>Back</button>
      </a>
      <button onClick={() => checkLocalStorageCart()}>Add to cart</button>
    </div>
  );
};

export default ItemPage;
