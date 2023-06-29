/* eslint-disable camelcase */
import React, { useState } from 'react';

function BookForm({ book, onCancel, onSave }) {
  const [title, setTitle] = useState(book?.title ?? '');
  const [author, setAuthor] = useState(book?.author ?? '');
  const [year, setYear] = useState(book?.publishedYear ?? '');
  const [price, setPrice] = useState(book?.price ?? '');
  const [genres, setGenres] = useState(book?.genres ?? '');
  const [description, setDescription] = useState(book?.description ?? '');
  const [url, setUrl] = useState(book?.image_url ?? '');

  const onSubmit = () => {
    if (book) {
      onSave({
        ...book,
        title,
        author,
        publishedYear: year,
        price,
        genres,
        description,
        image_url: url,
      });
    }

    onSave({
      title,
      author,
      publishedYear: year,
      price,
      genres,
      description,
      image_url: url,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="title">Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} name="title" id="title" />
      </div>

      <div className="control">
        <label htmlFor="author">Author:</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          name="author"
          id="author"
        />
      </div>

      <div className="control">
        <label htmlFor="year">Year:</label>
        <input value={year} onChange={(e) => setYear(e.target.value)} name="year" id="year" />
      </div>

      <div className="control">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          name="price"
          id="price"
        />
      </div>

      <div className="control">
        <label htmlFor="genres">Genres:</label>
        <input
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          name="genres"
          id="genres"
        />
      </div>

      <div className="control">
        <label htmlFor="description">Description:</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          id="description"
        />
      </div>

      <div className="control">
        <label htmlFor="url">url:</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} name="url" id="url" />
      </div>

      <div className="buttons">
        <button type="submit">{book ? 'Update book' : 'Create book'}</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default BookForm;
