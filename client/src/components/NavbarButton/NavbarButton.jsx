import React from 'react';
import './NavbarButton.css';

function NavbarButton({ text }) {
  return (
    <button className="button-48" role="button">
      <span className="text">
        {text}
      </span>
    </button>
  );
}

export default NavbarButton;
