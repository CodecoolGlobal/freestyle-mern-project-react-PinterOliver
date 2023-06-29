import { useState } from "react";
import "./BookFilter.css";

const BookFilter = (props) => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const [sortBy, setSortBy] = useState("title,ascend");

  const sliderStyles = {
    background: `linear-gradient(to right, #85bb65 0%, #85bb65 ${sliderValue}%, #d3d3d3 ${sliderValue}%, #d3d3d3 100%)`,
  };

  return (
    <div className="filterContainer">
      <div className="slidecontainer">
        <div className="sliderText">Price range: 1-{sliderValue}€</div>
        <input
          type="range"
          min="1"
          max="100"
          value={sliderValue}
          className="slider"
          id="myRange"
          onChange={handleSliderChange}
          style={sliderStyles}
        />
      </div>
      <h2>Sort Items</h2>
      <div className={"dropdown"}>
        <button className="dropbtn">{sortBy}</button>
        <div className="dropdown-content">
          <div onClick={() => setSortBy("title,ascend")}>Title, ascending</div>
          <div onClick={() => setSortBy("title,descend")}>
            Title, descending
          </div>
          <div onClick={() => setSortBy("author,ascend")}>
            Author, ascending
          </div>
          <div onClick={() => setSortBy("author,descend")}>
            Author, descending
          </div>
        </div>
      </div>
      <button
        onClick={
          (() => props.OnFilter(sliderValue), () => props.OnSort(sortBy))
        }
        className="filterButton"
      >
        Filter
      </button>
    </div>
  );
};

export default BookFilter;
