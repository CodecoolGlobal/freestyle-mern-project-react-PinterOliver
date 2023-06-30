import React from 'react';
import './NavbarButton.css';

function NavbarButton({ text, onClick }) {
  return (
    <button className="button-48" role="button" onClick={onClick}>
      <span className="text">
        {text}
      </span>
    </button>
  );
}

export default NavbarButton;
