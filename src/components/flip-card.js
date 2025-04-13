import React, { useState } from "react";
import "../css/flip-card.css";

const FlippableCard = ({updateContentPage, changeScrollable,  cardImage, frontContent}) => {
  const [tapped, setTapped] = useState(false)
  const updateTapped = () => {
    if (!tapped) {
      setTapped(true);
      setTimeout(() => {setTapped(false)}, 500)
    };
  };
  return (
    <div className={`flippable-card ${tapped ? "active" : ""}`}onClick={()=>{updateContentPage(); updateTapped()}}>
      <div className="card-inner">
        <div className="card-front">
          <img className="card-image" src={cardImage} alt="Card" />
          <div class="gradient-overlay"></div>
          <p className="front-headline">{frontContent}</p>
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
