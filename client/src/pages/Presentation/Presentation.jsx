import React from 'react';
import './Presentation.css';
import Team from './team.gif';
import Task from './task.gif';
import Challenge from './challenge.gif';
import Tour from './tour.gif';
import SnippetA1 from './snippetA0.png';
import SnippetA2 from './snippetA2.png';
import Funfact from './funfact.gif';
import Question from './question.gif';
import Feature from './new.gif';

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
            <li className='listItem'>Freestyle (sprint 2)</li>
            <li className='listItem'>MERN Stack</li>
            <li className='listItem'>CRUD Operations</li>
            <li className='listItem'>Book webshop</li>
          </ul>
        </div>

        <h2 className='prestitle'>New features</h2>
        <img className="tallpicture" src={Feature}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Store session-id as cookie</li>
            <li className='listItem'>Display books dynamically</li>
            <li className='listItem'>Send e-mail</li>
            <li className='listItem'>Chat</li>
          </ul>
        </div>

        <h2 className='prestitle'>Challenges</h2>
        <img className="picture" src={Challenge}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>PAs</li>
            <li className='listItem'>Slow internet</li>
            <li className='listItem'>Merge conflicts</li>
            <li className='listItem'>Bugs</li>
          </ul>
        </div>

        <h2 className='prestitle'>Site tour</h2>
        <a href='/'>
          <img className="bigpicture" src={Tour}/>
        </a>
        <h2 className='prestitle'>Code snippets</h2>

        <div className='snippetgroupb'>
          <img className="hugepicture" src={SnippetA1}/>
          <img className="hugetallpicture" src={SnippetA2}/>
        </div>

        <h2 className='prestitle'>Fun fact</h2>
        <img className="tallpicture" src={Funfact}/>
        <div className='listContainer'>
          <ul className='listing'>
            <li className='listItem'>Trello card: 38</li>
            <li className='listItem'>JS file: 63</li>
            <li className='listItem'>Git commit: 521</li>
          </ul>
        </div>

        <h2 className='prestitle'>Do you have any questions?</h2>
        <img className="tallbigpicture" src={Question}/>
      </div>
    </div>
  );
}

export default Presentation;
