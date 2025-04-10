import React, {useEffect,useState } from "react";
import "../css/content-page.css"
import backIcon from "../assets/back-icon.svg"
import "../css/settings.css";
const SettingsPage = ({changeShowScrollIndc, changeScrollable, updateSettingsPage, showContent}) => {
  const [disable, setDisable] = useState(false);

  const disableContentPage = () => {
    changeShowScrollIndc();
    changeScrollable(true);
    setDisable(true);
    setTimeout(() => {
      updateSettingsPage();
      changeScrollable(true)
    }, 300)
  };
  
  useEffect(() => {
    if (showContent) {
      changeScrollable(false); // Führt changeScrollable(true) aus, wenn infoContentPage auf false wechselt
    }
  }, [showContent, changeScrollable]);

  return (
    <>
      <div className="background" onClick={disableContentPage}></div> {/* Hintergrund liegt jetzt außerhalb! */}
      <div className={`content-page ${!disable ? "active" : "hidden"}`}>
        <div className="settings-top-bar">
          
          <button className="settings-back-button" onClick={disableContentPage}>
           <img src={backIcon} alt="back"></img>
          </button>
          <h1 className="settings-h1">Einstellungen</h1>
        </div>
        <div className="settings-list">
              
              <div className="settings">
                <div className="setting">
                  <div className="language"></div>
                  <div className="setting-content">
                    Sprache
                  </div>
                </div>

                <div className="setting">
                  <div className="plain-language"></div>
                  <div className="setting-content">
                    Einfache Sprache
                  </div>
                </div>
              </div>
            </div>
      </div>
    </>
  );
  
};
export default SettingsPage