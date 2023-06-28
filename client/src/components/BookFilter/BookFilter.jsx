import { useState } from "react";
import "./BookFilter.css";

const BookFilter = () => {

  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const sliderStyles = {
    background: `linear-gradient(to right, #85bb65 0%, #85bb65 ${sliderValue}%, #d3d3d3 ${sliderValue}%, #d3d3d3 100%)`
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
      <button>Filter</button>
    </div>
  );
};

export default BookFilter;
