import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/language-context"; // Pfad anpassen
import "../css/content-page.css";
import backIcon from "../assets/back-icon.svg";
import "../css/settings.css";

const SettingsPage = ({
  changeShowScrollIndc,
  changeScrollable,
  updateSettingsPage,
  showContent,
}) => {
  const [disable, setDisable] = useState(false);
  const { language, setLanguage } = useLanguage(); // Sprache aus dem globalen Context

  const disableContentPage = () => {
    changeShowScrollIndc();
    changeScrollable(true);
    setDisable(true);
    setTimeout(() => {
      updateSettingsPage();
      changeScrollable(true);
    }, 300);
  };

  useEffect(() => {
    if (showContent) {
      changeScrollable(false);
    }
  }, [showContent, changeScrollable]);

  const translations = {
    de: {
      settings: "Einstellungen",
      language: "Sprache",
      plainLanguage: "Einfache Sprache",
    },
    en: {
      settings: "Settings",
      language: "Language",
      plainLanguage: "Plain Language",
    },
  };

  return (
    <>
      <div className="background" onClick={disableContentPage}></div>
      <div className={`content-page ${!disable ? "active" : "hidden"}`}>
        <div className="settings-top-bar">
          <button className="settings-back-button" onClick={disableContentPage}>
            <img src={backIcon} alt="back" />
          </button>
          <h1 className="settings-h1">{translations[language].settings}</h1>
        </div>
        <div className="settings-list">
          <div className="settings">
            <div className="setting">
              <div className="language"></div>
              <div className="setting-content">
                <p>{translations[language].language}</p>
                <div className="language-buttons">
                  <button
                    className={language === "de" ? "active" : ""}
                    onClick={() => setLanguage("de")}
                  >
                    Deutsch
                  </button>
                  <button
                    className={language === "en" ? "active" : ""}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            <div className="setting">
              <div className="plain-language"></div>
              <div className="setting-content">
                {translations[language].plainLanguage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
