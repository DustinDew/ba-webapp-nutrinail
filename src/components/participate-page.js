import React, {useState } from "react";
import ImageAquisation from "./image-aquisation-process";
import Dialog from "./dialog";
import "../css/participate-page.css";
import FlippableCard from "./flip-card";
import helpRobot from "../assets/help-robot.jpg"
import ContentPage from "./content-page";
import process from "../assets/process.svg"

const ParticipatePage = ({changeShowScrollIndc, start, changeStart, changeScrollable}) => {
  const [processStarted, setProcessStarted] = useState(false);
  const [boxVisible, setBoxVisible] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [targetCoordinatesLeft, setTargetCoordsLeft] = useState([]);
  const [targetCoordinatesRight, setTargetCoordsRight] = useState([]);
  const [finished, setFinished] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [participateContentPage, setParticipateContentPage] = useState(false);

  const startProcess = () => {
    setProcessStarted(true);
    setShowCard(true);
    changeScrollable(false);
    setTimeout(() => setBoxVisible(true), 50);
  };
  
  const updateParticipateContentPage = () => {
    if (participateContentPage !== !participateContentPage) {
      setTimeout(() => {changeShowScrollIndc();}, 360) 
      changeScrollable(false); // Nur ausführen, wenn der Zustand sich ändert
      setParticipateContentPage(!participateContentPage);
    }
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
              cardImage={process}
              frontContent={
                <div className="front-container-1">
                  <div className="card-text-1">Wie funktionert die Teilnahme?</div>
                </div>
              }
              backContent={
                <div className="backText">
                  <p>Du möchtest wissen worum es bei unserem Projekt geht?</p>
                  <button className="content-button" onClick={() => {updateParticipateContentPage(); changeScrollable(false)}}>
                  Erfahre mehr!
                </button>
                  
                </div>
              }
              updateContentPage={updateParticipateContentPage}
            />

            <div className="participateCard">
              <button className={`startButton ${participated ? "disabled" : "active"}`} disabled={participated} onClick={() => {startProcess(); changeShowScrollIndc()}}>Teilnehmen</button>
              <p className="time-text">Zeitaufwand &lt; 5 Minuten</p>
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
      {participateContentPage && (
        <ContentPage
          bannerImg={helpRobot}
          contentBody={
            <>
              <h2>NutriNAIL: Wie Fingernägel Aufschluss über unsere Gesundheit geben können</h2>
              <p>
                NutriNAIL ist ein Forschungsprojekt der Hochschule Fulda, das untersucht, wie das Aussehen und die Zusammensetzung von Fingernägeln Rückschlüsse auf die Gesundheit geben können. Ziel des Projekts ist es, Zusammenhänge zwischen den Merkmalen der Nägel und verschiedenen gesundheitlichen Aspekten zu erforschen, um die Aussagen zu überprüfen, die oft über die Nägel gemacht werden.</p>
              <p>
                Im Rahmen des Projekts sammeln wir Bilder von Freiwilligen, die dazu verwendet werden, eine KI zu trainieren. Diese KI soll in der Lage sein, Muster und Strukturen in den Nägeln zu erkennen und auf dieser Basis Einschätzungen zur Gesundheit der Person zu liefern.</p>
              <p>
                Obwohl sich das Projekt noch in der Anfangsphase befindet, zeigen erste Ansätze vielversprechende Ergebnisse, die die Gesundheitsdiagnostik in der Zukunft revolutionieren könnten. NutriNAIL könnte sowohl Ärzten und Therapeuten neue diagnostische Hilfsmittel bieten als auch den Menschen helfen, ein besseres Verständnis für ihre eigene Gesundheit zu entwickeln.</p>
              <p>
                Neugierig geworden? Nimm an unserem Projekt teil und lade einfach Bilder deiner Nägel auf unserer Webseite hoch. Es dauert nur wenige Minuten und du unterstützt uns dabei, wertvolle wissenschaftliche Erkenntnisse zu gewinnen!</p>
            </>
          }
          changeShowScrollIndc={changeShowScrollIndc}
          changeScrollable={(bool) => changeScrollable(bool)}
          showContent={participateContentPage}
          updateInfoContentPage={updateParticipateContentPage}

        />
      )}
    </div>
  );
};

export default ParticipatePage;
