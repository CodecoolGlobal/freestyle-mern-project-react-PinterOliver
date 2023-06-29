import React, { useState } from 'react';
import './BookFilter.css';

const BookFilter = (props) => {
  const [sliderValue, setSliderValue] = useState(props.maxPrice);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const [sortBy, setSortBy] = useState('title,ascend');

  const sliderStyles = {
    background: `linear-gradient(to right, #85bb65 0%, #85bb65 ${
      sliderValue / 100
    }%, #d3d3d3 ${sliderValue / 100}%, #d3d3d3 100%)`,
  };

  function setTitle(string) {
    const title = string.replace('title,', 'Title, ');
    const mTitle = title.replace('author,', 'Author, ');
    const fTitle = mTitle.replace('end', 'ending');
    return fTitle;
  }

  return (
    <div className="filterContainer">
      <div className="slidecontainer">
        <div className="sliderText">Price range: 1-{sliderValue}HUF</div>
        <input
          type="range"
          min="1"
          max="10000"
          value={sliderValue}
          className="slider"
          id="myRange"
          onChange={handleSliderChange}
          style={sliderStyles}
        />
      </div>
      <h2>Sort Items</h2>
      <div className={'dropdown'}>
        <button className="dropbtn">{setTitle(sortBy)}</button>
        <div className="dropdown-content">
          <div onClick={() => setSortBy('title,ascend')}>Title, ascending</div>
          <div onClick={() => setSortBy('title,descend')}>
            Title, descending
          </div>
          <div onClick={() => setSortBy('author,ascend')}>
            Author, ascending
          </div>
          <div onClick={() => setSortBy('author,descend')}>
            Author, descending
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          props.OnSort(sortBy);
          props.OnFilter(sliderValue);
        }}
        className="filterButton"
      >
        Filter
      </button>
    </div>
  );
};

export default BookFilter;
