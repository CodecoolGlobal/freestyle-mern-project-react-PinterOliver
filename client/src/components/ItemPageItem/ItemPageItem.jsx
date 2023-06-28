import { useState } from "react";
import "./ItemPageItem.css";

const ItemPageItem = (props) => {
  function checkLocalStorageCart() {
    const cart = localStorage.getItem('cart');
    const hasCart = cart !== null && cart !== undefined;
    if (hasCart){
      addToCart(props.book);
    }
    else {
      const myObject =  {
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

  function addToCart( book ) {
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

  return (
    <div className="item">
      <img src={props.book.image_url} className="bookCover"></img>
      <h2>{props.book.title}</h2>
      <h3>Author: {props.book.author}</h3>
      <h3> Description</h3>
      <div className="description">{props.book.description}</div>
      <div>Price: {props.book.price}€</div>
      <button onClick={() => checkLocalStorageCart()}>Add to cart</button>
    </div>
  );
};

export default ItemPageItem;
