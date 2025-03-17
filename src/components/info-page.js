import React, { useState, useEffect } from "react";
import "../css/info-page.css";
import hochschuleLogo from "../assets/logo-hsFulda.svg";
import FlippableCard from "./flip-card";
import ContentPage from "./content-page";
import bannerImg from "../assets/35186134-fuer-die-analyse-der-fingernagelstruktur-wurden-fotos-gemacht-2s70.jpg"
import cardImgHand from "../assets/pexels-thisisengineering-3913025.jpg"
import logo from "../assets/logo-nutrinail.svg"
import processImg from "../assets/process.svg"
import team from "../assets/team-ill.jpg"

const InfoPage = ({ changeShowScrollIndc, changeScrollable, firstScroll }) => {
  const [processStarted, setProcessStarted] = useState(false);
  const [boxVisible, setBoxVisible] = useState(false);
  const [start, setStart] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [infoContentPage, setInfoContentPage] = useState(false);


  const updateInfoContentPage = () => {
    if (infoContentPage !== !infoContentPage) {
      changeShowScrollIndc(); 
      changeScrollable(false); // Nur ausführen, wenn der Zustand sich ändert
      setInfoContentPage(!infoContentPage);
    }
  };

  return (
    <div className="main-container">
      <div className="header-container">
        <img className="logo-nn" src={logo} alt="logo"></img>
        <h1>NUTRINAIL</h1>
      </div>
      <p className="intro-text">
        Die Zukunft der Gesundheitsforschung liegt im <span className="colored-detail">Det</span><span className="colored-letter"></span><span className="colored-letter">ai</span><span className="colored-detail">l.</span>
      </p>

      <div className="welcomeText">
        
        
        <div className="flip-card-container">
          <FlippableCard
            cardImage={cardImgHand}
            frontContent={
              <div className="front-container-1">
                <div className="card-text-1">Entdecke NutriNAIL</div>
              </div>
            }
            backContent={
              <div className="backText">
                <p>Du möchtest wissen worum es bei unserem Projekt geht?</p>
                <button className="content-button" onClick={()=>{updateInfoContentPage(); changeScrollable(false)}}>
                  Erfahre mehr!
                </button>
                
              </div>
            }
          />
          <FlippableCard
            cardImage={team}
            frontContent={
              <div className="front-container-1">
              
              <div className="card-text-2">Wer sind wir?</div>
            </div>
            }
            backContent={
              <div className="backText">
                <p>Coming soon</p>
              </div>
            }
          />
      </div>
      </div>
    
      <div className={`arrow ${firstScroll ? "active" : "off"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
          <path
            d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z"
            fill="#5a7aa7"
          />
        </svg>
      </div>

      {infoContentPage && (
        <ContentPage
          bannerImg={bannerImg}
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
          showContent={infoContentPage}
          updateInfoContentPage={updateInfoContentPage}

        />
      )}

    </div>
  );
};

export default InfoPage;
