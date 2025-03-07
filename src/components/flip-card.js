import React, {useState } from "react";

const FlippableCard = ({frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flippable-card ${isFlipped ? "flipped" : ""}`} 
      
      onMouseClick={() => setIsFlipped(true)}
      
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-inner">
        <div className="card-front">{frontContent}</div>
        <div className="card-back">{backContent}</div>
      </div>
    </div>
  );
};

export default FlippableCard;