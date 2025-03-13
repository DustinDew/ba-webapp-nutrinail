import React, {useState } from "react";
import CameraView from "./image-aquisation-process";
import Dialog from "./dialog";
import "../css/info-page.css";
import hochschuleLogo from "../assets/logo-hsFulda.svg";
import FlippableCard from "./flip-card";

const InfoPage = ({changeScrollable, firstScroll}) => {
  const [processStarted, setProcessStarted] = useState(false);
  //const [key, setKey] = useState(0);
  const [boxVisible, setBoxVisible] = useState(false);
  const [start , setStart] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  

  return (
    <div className="main-container">
      {!processStarted ? (
        <div className="welcomeText">
          <h1>NutriNAIL</h1>
          <img src={hochschuleLogo} alt="Logo" width="100px" height="100px" />
          

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
            <Dialog changeScrollable={() => changeScrollable(true)} changeShowCV={() => setShowCameraView(true)} changeBoxVis={() => setBoxVisible(false)} changeProcessState={() => setProcessStarted(false)}  changeShowCard={() => setShowCard(false)} changeStart={() => setStart(!start)}/>
          </>
          )}
          <div className={`cv ${showCameraView ? "visible" : "hidden"}`}><CameraView updateProcessRestart={() => setRestart(false)} processRestart={restart} changeStart={() => setStart(!start)} start={start} /*key={key}*//></div>
          <div className="button-container">
          </div>
        </div>
      )}
      <div className={`arrow ${firstScroll ? "active": "off"}`}>
        <svg  xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
          <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" fill="#5a7aa7"/>
        </svg>
      </div>
      
    </div>
  );
};

export default InfoPage;
