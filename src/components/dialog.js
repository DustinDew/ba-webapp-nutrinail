import React, { useEffect, useState } from "react";
import "../css/dialog.css"
import HandCalibration from "./hand-calibration";

const Dialog = ({changeShowScrollIndc, updateTargetCoordsLeft, updateTargetCoordsRight, changeScrollable, changeShowCV, changeStart, changeShowCard, changeProcessState,  changeBoxVis}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [buttonStateRight, setButtonStateRight] = useState(true);
  const [buttonStateLeft, setButtonStateLeft] = useState(true);
  const [handSide, setHandSide] = useState("Left");
  const [calSide, setCalSide] = useState("Right");
  const [calibrationFinished, setCalibrationFinished] = useState(false);

  const changeCardIndex = () => {
    if (cardIndex < 2) {
      setCardIndex(cardIndex + 1)
    }
  };

  const backButton = () => {
    if(cardIndex >= 1) {
      const currentIndex = cardIndex;
      setCardIndex(cardIndex - 1);
      return;
    };
    if (cardIndex === 0) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach(track => track.stop());
        console.log("Kamera gestoppt!");
      })
      .catch((err) => console.log("Kein aktiver Kamerastream gefunden:", err));
    }
    setCardIndex(0);
    changeProcessState();
    changeBoxVis();
    changeShowCard();
    changeScrollable();
    setButtonStateRight(true);
    changeShowScrollIndc();
  };
  useEffect(()=> {
    
  }, []);

  return (
    <div className="dialog">
      <div className="card">
        {cardIndex === 0 && (
          <>
          {!calibrationFinished ? (
            <>
            {calSide === "Right" && (
            <>
              <h2>Kalibrierung Rechts</h2>
              <HandCalibration updateCalSide={() => setCalSide("Left")} handSide={"Left"} updateHandSide={(side) => setHandSide(side)} updateButtonStateRight={()=>setButtonStateRight(false)} updateTargetCoordsLeft={(arr) => updateTargetCoordsLeft(arr)} updateTargetCoordsRight={(arr) => updateTargetCoordsRight(arr)}/>
            </>
            )}
            {calSide === "Left" && (
              <>
                <h2>Kalibrierung Links</h2>
                <HandCalibration updateCalFinished={() => setCalibrationFinished(!calibrationFinished)} handSide={"Right"} updateHandSide={(side) => setHandSide(side)} updateButtonStateLeft={()=>setButtonStateLeft(false)} updateTargetCoordsLeft={(arr) => updateTargetCoordsLeft(arr)} updateTargetCoordsRight={(arr) => updateTargetCoordsRight(arr)}/>
              </>
            )}
            </>
          ): (
            <>
            <h2>Kalibrierung</h2>
            <div className="loading-screen-cal-na"> 
            <div className="calDone-text1-na">Kalibrierung erfolgreich!</div>
            <svg className="checkmark-na" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle-na" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check-na" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div className="calDone-text2">Klicke auf Weiter</div>
          </div>
            </>
          )}

          
              <button className="backButton" onClick={backButton}>Zurück</button>
              <button className={`continueBttn ${!buttonStateLeft ? "active" : "disabled"}`} disabled={buttonStateLeft} onClick={ () => {changeCardIndex(); setCalibrationFinished(true)}}>Weiter</button>
          </>
        )}
        {cardIndex === 1 && (
          <>
            <h2>Schritt 2</h2>
            <p>Weitere Erklärungen Hier!</p>
            <button className="backButton" onClick={backButton}>Zurück</button>
            <button className={`continueBttn ${!buttonStateLeft ? "active" : "disabled"}`} disabled={buttonStateLeft} onClick={ () => {changeCardIndex(); changeStart()}}>Weiter</button>
          </>
        )}
        {cardIndex === 2 && (
          <>
            <h2>Schritt 3:</h2>
            <p>Sobald alle Finger in Position sind, wird automatisch ein Bild aufgenommen, die Hand muss solange still gehalten werden.</p>
      
            <button className="backButton" onClick={backButton}>Zurück</button>
            <button onClick={() => {changeShowCard();changeShowCV()}}>Starten</button>
          </>
        )}
        <div className="ball-row">
          <div className={`kugel ${cardIndex === 0 ? "on" : "off"}`} onClick={() => setCardIndex(0)}></div>
          <div className={`kugel ${cardIndex === 1 ? "on" : "off"}`} onClick={() => setCardIndex(1)}></div>
          <div className={`kugel ${cardIndex === 2 ? "on" : "off"}`} onClick={() => setCardIndex(2)}></div>
        </div>
      </div>
    </div>
  );
};
export default Dialog;