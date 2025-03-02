'use client'

import { useState } from 'react';

const ToggleInvertColors = () => {
  const [isInverted, setIsInverted] = useState(false);

  const toggleInvert = () => {
    setIsInverted((prev) => !prev);
    document.body.classList.toggle('inverted'); 
  };

  return (
    <button
      onClick={toggleInvert}
      style={{
          position: "fixed",
          top: "10px", 
          right: "10px",
          zIndex: 1000,
          width: "50px", 
          height: "50px", 
          backgroundColor: "#0070f3", 
          border: "2px solid #ffffff", 
          borderRadius: "8px", 
          cursor: "pointer",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          transition: "background-color 0.3s ease", 
    }}
   >
      {isInverted ? '' : ''}
      <span style={{ color: "#ffffff", fontSize: "20px" }}>💡</span> {/* Light emoji */}
    </button>
  );
};

export default ToggleInvertColors;
