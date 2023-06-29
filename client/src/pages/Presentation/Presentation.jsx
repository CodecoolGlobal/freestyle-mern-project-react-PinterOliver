import React from 'react';
import './Presentation.css';

function Presentation() {
  return (
    <div className='presentationContainer' >
      <img className="logo" src={'icon.png'} alt="logo" />
      <h1>Presentation</h1>
      <h2>Team members</h2>
      <div className='listContainer'>
        <ul className='listing'>
          <li className='listItem'>Bebe</li>
          <li className='listItem'>Dani</li>
          <li className='listItem'>Oliver</li>
          <li className='listItem'>Tomi</li>
        </ul>
      </div>
      <h2>Task</h2>
      <div className='listContainer'>
        <ul className='listing'>
          <li className='listItem'>Freestyle</li>
          <li className='listItem'>MERN Stack</li>
          <li className='listItem'>CRUD Operations</li>
          <li className='listItem'>Book webshop</li>
        </ul>
      </div>
      <h2>Challenges</h2>
      <div className='listContainer'>
        <ul className='listing'>
          <li className='listItem'>Communication</li>
          <li className='listItem'>Git branches</li>
          <li className='listItem'>Testing & debugging</li>
          <li className='listItem'>Slow internet in CodeCool</li>
          <li className='listItem'>Mongoose filtering</li>
        </ul>
      </div>
      <h2>Site tour</h2>
      <a href='/'>
      </a>
      <h2>Code snippets</h2>
    </div>
  );
}

export default Presentation;
