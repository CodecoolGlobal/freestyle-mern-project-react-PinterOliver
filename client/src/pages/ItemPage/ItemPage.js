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

  return (
    <div>
      <a href={'http://localhost:3000/books'}>
        <button>Back</button>
      </a>
      <div className="itemContainer">
        {book && book ?
          <ItemPageItem book={book} />
          : null}
      </div>
    </div>
  );
};

export default ItemPage;
