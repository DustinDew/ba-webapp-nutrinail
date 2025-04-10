import React, {useEffect,useState } from "react";
import "../css/content-page.css"
import backIcon from "../assets/back-icon.svg"
const ContentPage = ({bannerImg, contentBody, changeShowScrollIndc, changeScrollable, updateInfoContentPage, showContent}) => {
  const [disable, setDisable] = useState(false);

  const disableContentPage = () => {
    changeShowScrollIndc();
    changeScrollable(true);
    setDisable(true);
    setTimeout(() => {
      updateInfoContentPage();
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
        <div className="top-bar">
          <button className="content-back-button" onClick={disableContentPage}>
          <img src={backIcon} alt="back"></img>
          </button>
        </div>
        <div className="content-container">
          
          <div className="image-container">
            
            <img src={bannerImg} alt="Banner"></img>
          </div>
          <div className="line"></div>
          <div className="content-body">{contentBody}</div>
        </div>
      </div>
    </>
  );
  
};
export default ContentPage