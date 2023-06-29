import { useState } from "react";
import "./BookItem.css";

const BookItem = (props) => {
  function checkLocalStorageCart() {
    const cart = localStorage.getItem("cart");
    const hasCart = cart !== null && cart !== undefined;
    if (hasCart) {
      addToCart(props.book);
    } else {
      const myObject = {
        [props.book._id]: {
          title: props.book.title,
          price: props.book.price,
          amount: 1,
        },
      };
      // Convert the JSON object to a string
      const jsonString = JSON.stringify(myObject);
      // Save the stringified JSON object to local storage
      localStorage.setItem("cart", jsonString);
    }
  }

  const [book, setBook] = useState(props.book);

  function addToCart(book) {
    const storedJsonString = localStorage.getItem("cart");
    const storedObject = JSON.parse(storedJsonString);

    if (storedObject[book._id]) {
      storedObject[book._id].amount++;
      const jsonString = JSON.stringify(storedObject);
      localStorage.setItem("cart", jsonString);
    } else {
      storedObject[book._id] = {
        title: book.title,
        price: book.price,
        amount: 1,
      };
      // Convert the JSON object to a string
      const jsonString = JSON.stringify(storedObject);
      // Save the stringified JSON object to local storage
      localStorage.setItem("cart", jsonString);
    }

    return null;
  }
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
        <button onClick={() => checkLocalStorageCart()}>Add to cart</button>
      </div>
    </div>
  );
};

export default BookItem;
