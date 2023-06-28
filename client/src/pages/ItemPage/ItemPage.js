import { useState, useEffect } from "react";
import "./ItemPage.css";

const ItemPage = (props) => {
  const path = window.location.pathname;
  const id = path.substring(path.lastIndexOf("/") + 1);

  const [book, setBook] = useState([]);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data.book);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <a href={`http://localhost:3000/books`}>
        <button>Back</button>
      </a>
      {book && book ? 
      (<div>{book.title}</div>,
      <img src={book.image_url}></img>)
       : null}
    </div>
  );
};

export default ItemPage;
