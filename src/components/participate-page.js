import React, { useState, useContext } from "react";
import ImageAquisation from "./image-aquisation-process";
import Dialog from "./dialog";
import "../css/participate-page.css";
import FlippableCard from "./flip-card";
import helpRobot from "../assets/help-robot.jpg";
import ContentPage from "./content-page";
import process from "../assets/processIll.jpg";
import { LanguageContext } from "../context/language-context"; // Hier wird der Kontext verwendet

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

  const { language } = useContext(LanguageContext); // Sprachauswahl aus dem Kontext

  const translations = {
    de: {
      title: "Teilnahme",
      howItWorks: "Wie funktioniert die Teilnahme?",
      timeRequired: "Zeitaufwand < 5 Minuten",
      participate: "Teilnehmen",
      thanks: "Danke für deine Teilnahme!",
      exit: "Beenden",
      impressum: "Impressum",
      privacy: "Datenschutz",
      cardTitle: "So funktioniert die Teilnahme:",
      description1: "Um an der Bildaufnahme teilzunehmen, müssen insgesamt vier Bilder gemacht werden: Zuerst wird die linke Hand, dann der linke Daumen, gefolgt von der rechten Hand und schließlich der rechte Daumen aufgenommen.",
      description2: "Dies geschieht automatisch mithilfe von MediaPipe, einer Technologie zur Handerkennung, die sicherstellt, dass jedes Bild erst aufgenommen wird, wenn die Hand in der richtigen Position vor der Kamera ist. Sobald die Hände korrekt ausgerichtet sind, wird das Bild automatisch aufgenommen.",
      description3: "Die aufgenommenen Bilder werden in einer Datenbank gespeichert und anschließend zum Training eines Convolutional Neural Networks (CNN) verwendet.",
    },
    en: {
      title: "Participation",
      howItWorks: "How does participation work?",
      timeRequired: "Time required < 5 minutes",
      participate: "Participate",
      thanks: "Thank you for your participation!",
      exit: "Exit",
      impressum: "Imprint",
      privacy: "Privacy",
      cardTitle: "How Participation Works:",
      description1: "To participate, a total of four images will be captured: first, the left hand, followed by the left thumb, then the right hand, and finally the right thumb.",
      description2: "This process is fully automated using MediaPipe, a hand detection technology that ensures each image is only taken when the hand is in the correct position in front of the camera. Once the hands are properly aligned, the image is automatically captured.",
      description3: "The captured images are stored in a database and later used to train a Convolutional Neural Network (CNN).",
    }
  };

  const t = translations[language]; // Dynamische Auswahl basierend auf der Sprache

  const startProcess = () => {
    setProcessStarted(true);
    setShowCard(true);
    changeScrollable(false);
    setTimeout(() => setBoxVisible(true), 50);
  };
  
  const updateParticipateContentPage = () => {
    if (participateContentPage !== !participateContentPage) {
      setTimeout(() => {changeShowScrollIndc();}, 360); 
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
        <>
          {!processStarted ? (
            <div className="participateText">
              <h1>{t.title}</h1>
              <div className="seperator" id="top-seperator"></div>
              <div className="participate-container">
                <FlippableCard
                  cardImage={process}
                  frontContent={
                    <div className="front-container-1">
                      <div className="card-text-1">{t.howItWorks}</div>
                    </div>
                  }
                  updateContentPage={updateParticipateContentPage}
                />

                <div className="participateCard">
                  <button className={`startButton ${participated ? "disabled" : "active"}`} disabled={participated} onClick={() => {startProcess(); changeShowScrollIndc()}}>{t.participate}</button>
                  <p className="time-text">{t.timeRequired}</p>
                </div>
              </div>
              <footer className="participate-footer">
                <a href="/impressum" target="_blank" rel="noopener noreferrer">{t.impressum}</a> · <a href="/datenschutz" target="_blank" rel="noopener noreferrer">{t.privacy}</a>
              </footer> 
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
            <div className="thx">{t.thanks}</div>
            <button className="exit-button" onClick={resetProcess}>{t.exit}</button>
          </div>
        </>
      )}
      {participateContentPage && (
        <ContentPage
          bannerImg={helpRobot}
          contentBody={
            <>
             <h2>{t.title}</h2>
              <p>{t.description1}</p>
              <p>{t.description2}</p>
              <p>{t.description3}</p>
              <p>{t.description4}</p>
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
