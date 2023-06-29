import { useState } from "react";
import "./ItemPageItem.css";

const ItemPageItem = (props) => {
  
  const book = props.book

  function checkLocalStorageCart() {
    const cart = localStorage.getItem("cart");
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
  return (
    <div className="item">
      <img src={props.book.image_url} className="bookCover"></img>
      <h2>{props.book.title}</h2>
      <h3>Author: {props.book.author}</h3>
      <h3> Description</h3>
      <div className="description">{props.book.description}</div>
      <div>Price: {props.book.price}HUF</div>
      <button onClick={() => checkLocalStorageCart()}>Add to cart</button>
    </div>
  );
};

export default ItemPageItem;
