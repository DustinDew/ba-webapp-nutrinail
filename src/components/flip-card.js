import React, { useState } from "react";
import "../css/flip-card.css";

const FlippableCard = ({ cardImage, frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flippable-card ${isFlipped ? "flipped" : ""}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-inner">
        <div className="card-front">
          <img className="card-image" src={cardImage} alt="Card" />
          <p className="front-headline">{frontContent}</p>
        </div>
        <div className="card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
