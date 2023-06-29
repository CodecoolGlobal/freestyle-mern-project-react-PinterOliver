import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Presentation() {
  

  return (
    <div className='presentationContainer' style={{
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      }}>
      <img className="logo" src={'icon.png'} alt="logo" style={{height: '200px'}} />
      <div>Presentation</div>
      <div>Presentation</div>
      <div>Presentation</div>
      <div>Presentation</div>
    </div>
  );
}

export default Presentation;
