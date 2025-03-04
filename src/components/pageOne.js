import React, { useEffect, useState } from "react";
import CameraView from "./CameraView";
import Dialog from "./dialog";
import "../css/pageOne.css";

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

const MainContent = ({changeScrollable}) => {
  const [processStarted, setProcessStarted] = useState(false);
  const [key, setKey] = useState(0);
  const [boxVisible, setBoxVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [start , setStart] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);

  const startProcess = () => {
    setProcessStarted(true);
    setShowCard(true);
    changeScrollable(false);
    setTimeout(() => setBoxVisible(true), 50);
  };

  const resetProcess = () => {
    if (window.confirm("Vorgang abbrechen?")) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          stream.getTracks().forEach(track => track.stop());
          console.log("Kamera gestoppt!");
        })
        .catch((err) => console.log("Kein aktiver Kamerastream gefunden:", err));
      setButtonVisible(false);
      setBoxVisible(false);
      changeScrollable(true);
      setTimeout(() => {
        setProcessStarted(false);
        setKey(prevKey => prevKey + 1);
        setShowCameraView(false);
      }, 500);
    } else {
      setRestart(true);
    };
  };

  return (
    <div className="main-container">

      

      {!processStarted ? (
        <div className="welcomeText">
          <h1 className="nutrinail">NutriNAIL</h1>
          <h3>Willkommen auf unserer Projektseite!</h3> 

          <FlippableCard 
            frontContent={<p>Hier erfährst du mehr über unser Forschungsprojekt</p>} 
            backContent={
              <div className="backText">
                <p>Mehr Informationen über NutriNAIL findest du hier.</p>
              </div>} 
          />
          <FlippableCard 
            frontContent={<p>Was ist Unser Ziel?</p>} 
            backContent={
              <div className="backText">
                <p>Mehr Informationen über NutriNAIL findest du hier.</p>
              </div>} 
          />
          

        </div> 
      ) : (
        <div className={`box ${boxVisible ? "fade-in" : "fade-out"}`}>
          {showCard && (
          <>
            <Dialog changeScrollable={() => changeScrollable(true)} changeShowCV={() => setShowCameraView(true)} changeBoxVis={() => setBoxVisible(false)} changeProcessState={() => setProcessStarted(false)} changeButtonVis={() => setButtonVisible(true)} changeShowCard={() => setShowCard(false)} changeStart={() => setStart(!start)}/>
          </>
          )}
          <div className={`cv ${showCameraView ? "visible" : "hidden"}`}><CameraView updateProcessRestart={() => setRestart(false)} processRestart={restart} changeStart={() => setStart(!start)} start={start} key={key}/></div>
          <div className="button-container">
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
