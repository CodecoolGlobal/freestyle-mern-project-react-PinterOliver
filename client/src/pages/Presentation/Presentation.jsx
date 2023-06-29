import React from 'react';
import './Presentation.css';
import Team from './team.gif';
import Task from './task.gif';
import Challenge from './challenge.gif';
import Tour from './tour.gif';
import SnippetA1 from './snippetA1.png';
import SnippetA2 from './snippetA2.png';
import LocalStorage from './localstorage.png';
import SnippetB1 from './snippetB1.png';
import SnippetB2 from './snippetB2.png';
import Funfact from './funfact.gif';
import Question from './question.gif';

function Presentation() {
  return (
    <div className='container'>
      <div className='background'></div>
      <div className='presentationContainer' >
        <img className="preslogo" src={'logo.png'} alt="logo" />
        <h2 className='prestitle'>Team members</h2>
        <img className="picture" src={Team}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Bebe</li>
            <li className='listItem'>Dani</li>
            <li className='listItem'>Oliver</li>
            <li className='listItem'>Tomi</li>
          </ul>
        </div>
        <h2 className='prestitle'>Task</h2>
        <img className="picture" src={Task}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Freestyle</li>
            <li className='listItem'>MERN Stack</li>
            <li className='listItem'>CRUD Operations</li>
            <li className='listItem'>Book webshop</li>
          </ul>
        </div>
        <h2 className='prestitle'>Challenges</h2>
        <img className="picture" src={Challenge}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Communication</li>
            <li className='listItem'>Git branches</li>
            <li className='listItem'>Testing & debugging</li>
            <li className='listItem'>Slow internet in CodeCool</li>
            <li className='listItem'>Mongoose filtering</li>
          </ul>
        </div>
        <h2 className='prestitle'>Site tour</h2>
        <a href='/'>
          <img className="bigpicture" src={Tour}/>
        </a>
        <h2 className='prestitle'>Code snippets</h2>
        <div className='snippetgroupa'>
          <img className="hugepicture" src={SnippetA1}/>
          <img className="hugepicture" src={SnippetA2}/>
          <img className="hugepicture" src={LocalStorage}/>
        </div>
        <div className='snippetgroupb'>
          <img className="hugepicture" src={SnippetB1}/>
          <img className="hugepicture" src={SnippetB2}/>
        </div>
        <h2 className='prestitle'>Fun fact</h2>
        <img className="tallpicture" src={Funfact}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Trello card: 32</li>
            <li className='listItem'>JS file: 47</li>
            <li className='listItem'>Git commit: 356</li>
          </ul>
        </div>
        <h2 className='prestitle'>Do you have any questions?</h2>
        <img className="tallbigpicture" src={Question}/>
      </div>
    </div>
  );
}

export default Presentation;
