import React, {useEffect, useState, useContext } from "react";
import "../css/info-page.css";
import FlippableCard from "./flip-card";
import ContentPage from "./content-page";
import bannerImg from "../assets/35186134-fuer-die-analyse-der-fingernagelstruktur-wurden-fotos-gemacht-2s70.jpg";
import logo from "../assets/logo-nutrinail.svg";
import settings from "../assets/settings.svg";
import SettingsPage from "./settings";
import swipeIcon from "../assets/swipe-icon.svg";
import handIll from "../assets/hand-ill.jpg";
import teamIll from "../assets/team.jpg";
import { LanguageContext } from "../context/language-context"; // ggf. Pfad anpassen
import team from "../assets/teams.jpg"

const InfoPage = ({ changeShowScrollIndc, changeScrollable, firstScroll }) => {
  const [infoContentPage, setInfoContentPage] = useState(false);
  const [settingsPage, setSettingsPage] = useState(false);
  const [teamPage, setTeamPage] = useState(false);
  const { language } = useContext(LanguageContext);

  const updateInfoContentPage = () => {
    if (infoContentPage !== !infoContentPage) {
      setTimeout(() => {
        changeShowScrollIndc();
      }, 360);
      changeScrollable(false);
      setInfoContentPage(!infoContentPage);
    }
  };

  const updateSettingsPage = () => {
    if (settingsPage !== !settingsPage) {
      setTimeout(() => {
        changeShowScrollIndc();
      }, 360);
      changeScrollable(false);
      setSettingsPage(!settingsPage);
    }
  };
  const updateTeamPage = () => {
    if (teamPage !== !teamPage) {
      setTimeout(() => {
        changeShowScrollIndc();
      }, 360);
      changeScrollable(false);
      setTeamPage(!teamPage);
    }
  }

  const translations = {
    de: {
      slogan: "Die Zukunft deiner Gesundheit liegt im",
      discover: "Entdecke NutriNAIL",
      whoAreWe: "Wer sind wir?",
      comingSoon: "Coming soon",
      h2: "NutriNAIL: Was deine Fingernägel über deine Gesundheit verraten",
      p1: "NutriNAIL ist ein Forschungsprojekt der Hochschule Fulda, das untersucht, wie das Aussehen und die Zusammensetzung von Fingernägeln Rückschlüsse auf die Gesundheit geben können. Ziel des Projekts ist es, Zusammenhänge zwischen den Merkmalen der Nägel und verschiedenen gesundheitlichen Aspekten zu erforschen, um die Aussagen zu überprüfen, die oft über die Nägel gemacht werden.",
      p2: "Im Rahmen des Projekts sammeln wir Bilder von Freiwilligen, die dazu verwendet werden, eine KI zu trainieren. Diese KI soll in der Lage sein, Muster und Strukturen in den Nägeln zu erkennen und auf dieser Basis Einschätzungen zur Gesundheit der Person zu liefern.",
      p3: "Obwohl sich das Projekt noch in der Anfangsphase befindet, zeigen erste Ansätze vielversprechende Ergebnisse, die die Gesundheitsdiagnostik in der Zukunft revolutionieren könnten. NutriNAIL könnte sowohl Ärzten und Therapeuten neue diagnostische Hilfsmittel bieten als auch den Menschen helfen, ein besseres Verständnis für ihre eigene Gesundheit zu entwickeln.",
      p4: "Neugierig geworden? Nimm an unserem Projekt teil und lade einfach Bilder deiner Nägel auf unserer Webseite hoch. Es dauert nur wenige Minuten und du unterstützt uns dabei, wertvolle wissenschaftliche Erkenntnisse zu gewinnen!"
    },
    en: {
      slogan: "The future of your health is in the",
      discover: "Discover NutriNAIL",
      whoAreWe: "Who are we?",
      comingSoon: "Coming soon",
      h2: "NutriNAIL: What your nails reveal about your health",
      p1: "NutriNAIL is a research project at Fulda University of Applied Sciences that investigates how the appearance and composition of fingernails can provide insight into a person's health. The aim is to explore connections between nail characteristics and various health factors, to verify common assumptions about nails.",
      p2: "As part of the project, we collect images from volunteers to train an AI. This AI aims to identify patterns and structures in nails and assess possible health indicators.",
      p3: "Although the project is still in an early phase, initial findings are promising and could revolutionize health diagnostics in the future. NutriNAIL could provide new diagnostic tools for healthcare professionals and help individuals better understand their own health.",
      p4: "Curious? Take part in our project and upload images of your nails via our website. It only takes a few minutes and supports valuable scientific research!"
    }
  };

  const t = translations[language];

  return (
    <div className="main-container">
      <div className="header-container">
        <img className="logo-nn" src={logo} alt="logo" />
        <h1>NUTRINAIL</h1>
        <img
          onClick={updateSettingsPage}
          id="settings-icon"
          src={settings}
          alt="settings"
        />
      </div>

      <div className="seperator"></div>

      <p className="intro-text">
      {t.slogan}  <span className="colored-detail">Det</span>
        <span className="colored-letter">ai</span>
        <span className="colored-detail">l.</span>
      </p>

      <div className="welcomeText">
        <div className="flip-card-container">
          <FlippableCard
            cardImage={handIll}
            frontContent={
              <div className="front-container-1">
                <div className="card-text-1">{t.discover}</div>
              </div>
            }
            updateContentPage={updateInfoContentPage}
          />
          <FlippableCard
            cardImage={teamIll}
            frontContent={
              <div className="front-container-1">
                <div className="card-text-2">{t.whoAreWe}</div>
              </div>
            }
            updateContentPage={updateTeamPage}
          />
        </div>
      </div>

      <div className={`arrow-container ${firstScroll ? "active" : "off"}`}>
        <div className={`arrow ${firstScroll ? "active" : "off"}`}>
          <img id="swipe-icon" src={swipeIcon} alt="swipe" />
        </div>
      </div>

      {infoContentPage && (
        <ContentPage
          bannerImg={bannerImg}
          contentBody={
            <>
              <h2>{t.h2}</h2>
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
              <p>{t.p4}</p>
            </>
          }
          changeShowScrollIndc={changeShowScrollIndc}
          changeScrollable={(bool) => changeScrollable(bool)}
          showContent={infoContentPage}
          updateInfoContentPage={updateInfoContentPage}
        />
      )}
      {teamPage && (
        <ContentPage
          bannerImg={team}
          contentBody={
            <>
              <h1 style={{ color: 'white' }}>Coming soon</h1>
            </>
          }
          changeShowScrollIndc={changeShowScrollIndc}
          changeScrollable={(bool) => changeScrollable(bool)}
          showContent={infoContentPage}
          updateInfoContentPage={updateTeamPage}
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
