import React, { useState} from "react";
import "../css/info-page.css";
import FlippableCard from "./flip-card";
import ContentPage from "./content-page";
import bannerImg from "../assets/35186134-fuer-die-analyse-der-fingernagelstruktur-wurden-fotos-gemacht-2s70.jpg"
import cardImgHand from "../assets/pexels-thisisengineering-3913025.jpg"
import logo from "../assets/logo-nutrinail.svg"
import team from "../assets/team-ill.jpg"
import settings from "../assets/settings.svg"
import SettingsPage from "./settings";
import swipeIcon from "../assets/swipe-icon.svg"

const InfoPage = ({ changeShowScrollIndc, changeScrollable, firstScroll }) => {
  const [infoContentPage, setInfoContentPage] = useState(false);
  const [settingsPage, setSettingsPage] = useState(false);

  const updateInfoContentPage = () => {
    if (infoContentPage !== !infoContentPage) {
      setTimeout(() => {changeShowScrollIndc();}, 360)
       
      changeScrollable(false); // Nur ausführen, wenn der Zustand sich ändert
      setInfoContentPage(!infoContentPage);
    }
  };

  const updateSettingsPage = () => {
    if (settingsPage !== !settingsPage) {
      setTimeout(() => {changeShowScrollIndc();}, 360) 
      changeScrollable(false); // Nur ausführen, wenn der Zustand sich ändert
      setSettingsPage(!settingsPage);
    }
  };
  return (
    <div className="main-container">
      <div className="header-container">
        <img className="logo-nn" src={logo} alt="logo"></img>
        <h1>NUTRINAIL</h1>
        <img onClick={updateSettingsPage} id="settings-icon" src={settings}alt="settings"></img>
      </div>
      <p className="intro-text">
        Die Zukunft unserer Gesundheit liegt im <span className="colored-detail">Det</span><span className="colored-letter"></span><span className="colored-letter">ai</span><span className="colored-detail">l.</span>
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
            updateContentPage = {updateInfoContentPage}
            
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
    
      <div className={`arrow-container ${firstScroll ? "active" : "off"}`}>
        <div id="swipe-line"></div>
        <div className={`arrow ${firstScroll ? "active" : "off"}`}>
          <img id="swipe-icon" src={swipeIcon} alt="settings" />
        </div>
        
      </div>     
      {infoContentPage && (
        <ContentPage
          bannerImg={bannerImg}
          contentBody={
            <>
              <h2>NutriNAIL: Was deine Fingernägel über deine Gesundheit verraten</h2>
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
      {settingsPage && (
        <SettingsPage
          changeShowScrollIndc={changeShowScrollIndc}
          changeScrollable={(bool) => changeScrollable(bool)}
          showContent={infoContentPage}
          updateSettingsPage={updateSettingsPage}
        />
      )}
    </div>
  );
};

export default InfoPage;
