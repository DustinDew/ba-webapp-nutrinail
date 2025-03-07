import React, {useState } from "react";
import ImageAquisation from "./image-aquisation-process";
import Dialog from "./dialog";
import "../css/participate-page.css";
import FlippableCard from "./flip-card";

const ParticipatePage = ({changeShowScrollIndc, start, changeStart, changeScrollable}) => {
  const [processStarted, setProcessStarted] = useState(false);
  const [key, setKey] = useState(0);
  const [boxVisible, setBoxVisible] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [targetCoordinatesLeft, setTargetCoordsLeft] = useState([]);
  const [targetCoordinatesRight, setTargetCoordsRight] = useState([]);
  const [finished, setFinished] = useState(false);
  const [participated, setParticipated] = useState(false);

  const startProcess = () => {
    setProcessStarted(true);
    setShowCard(true);
    changeScrollable(false);
    setTimeout(() => setBoxVisible(true), 50);
  };
  
  const resetProcess = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach(track => track.stop());
        console.log("Kamera gestoppt!");
      })
      .catch((err) => console.log("Kein aktiver Kamerastream gefunden:", err));
    setBoxVisible(false);
    changeScrollable(true);
    setTimeout(() => {
      setProcessStarted(false);
      setKey(prevKey => prevKey + 1);
      setShowCameraView(false);
      setParticipated(true);
      setFinished(false);
      changeShowScrollIndc();
    }, 500);
  };
 
  return (
    <div className="main-container">

      
{!finished ? 
      (
        <>{!processStarted ? (
          <div className="participateText">
            <h1>Teilnahme</h1>

            <FlippableCard 
              frontContent={<p>Teilnahme-Informationen</p>} 
              backContent={
                <div className="backText">
                  <p>Informationen</p>
                </div>} 
            />

            <div className="participateCard">
              <p>Du weißt schon, worum es bei NutriNAIL geht? Dann kommst du hier direkt weiter!</p>
              <button className={`startButton ${participated ? "disabled" : "active"}`} disabled={participated} onClick={() => {startProcess(); changeShowScrollIndc()}}>Teilnehmen</button>
            </div>

          </div> 
        ) : (
          <div className={`box ${boxVisible ? "fade-in" : "fade-out"}`}>
            {showCard && (
            <>
              <Dialog changeShowScrollIndc={() => changeShowScrollIndc()} updateTargetCoordsLeft={(arr) => setTargetCoordsLeft(arr)} updateTargetCoordsRight={(arr) => setTargetCoordsRight(arr)} changeScrollable={() => changeScrollable(true)} changeShowCV={() => setShowCameraView(true)} changeBoxVis={() => setBoxVisible(false)} changeProcessState={() => setProcessStarted(false)} changeShowCard={() => setShowCard(false)} changeStart={() => changeStart()}/>
            </>
            )}
            <div className={`cv ${showCameraView ? "visible" : "hidden"}`}><ImageAquisation updateFinished={() => setFinished(true)} targetPositionsRight={targetCoordinatesRight} targetPositionsLeft={targetCoordinatesLeft} updateProcessRestart={() => setRestart(false)} processRestart={restart} changeStart={() => changeStart()} start={start} /*key={key}*//></div>
          </div>
        )}
        </>
      ) : (
        <>
          <div className="finished-container">
            <div className="thx">Danke für deine Teilnahme!</div>
            <p>Falls du noch Zeit hast nimm doch gerne an unserer Umfrage teil.</p>
            <button className="exit-button" onClick={resetProcess}>Beenden</button>
            <button className="survey-button">Umfrage</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ParticipatePage;
