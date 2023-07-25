import React from 'react';
import './ItemPageItem.css';

const ItemPageItem = ({ book }) => {
  return (
    <div className="item">
      <div className="coverContainer">
        <img src={book.image_url}></img>
      </div>
      <div className="detailsContainer">
        <h2>{book.title}</h2>
        <h3>{book.author}</h3>
        <p>{book.description}</p>
        <div>{book.price}HUF</div>
      </div>
    </div>
  );
};

export default ItemPageItem;
