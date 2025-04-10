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
      setCardIndex(cardIndex - 1);
      return;
    };
    if (cardIndex === 1) {
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
            <h2>Prozessablauf</h2>
            <div className="process-plan">
              
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Handkalibrierung</h3>
                    <p>Die Abstände zwischen deinen Fingern werden erfasst. Zielbereiche erscheinen auf dem Kamera-Stream, in denen sich deine Finger befinden müssen. Alles andere passiert automatisch.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Bildaufnahme</h3>
                    <p>Zuerst Zeige- bis kleiner Finger, dann der Daumen. Sobald deine Finger in den Zielbereichen sind, wird automatisch ein Bild aufgenommen.</p>
                  </div>
                </div>


                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Prozessabschluss</h3>
                    <p>Nach der Aufnahme folgt ein kurzer Fragebogen. Damit hilfst du uns, die Daten besser zu verstehen.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="backButton" onClick={backButton}>Zurück</button>
            <button className={`continueBttn ${true ? "active" : "disabled"}`} onClick={ () => {changeCardIndex()}}>Weiter</button>
          </>
        )}
        {cardIndex === 1 && (
          <>
          <h2>Wichtig für die Bildaufnahme</h2>
            <div className="rules-container">
              
              <div className="rules">
              
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>Einen flachen, gut belichteten Untergrund wählen – am besten mit natürlichem Licht.</p>
                </div>
                <div className="rule">
                <div className="step-number">!</div>
                  <p>Die Hand flach auf den Untergrund legen und absolut stillhalten.</p>
                </div>
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>Das Handy zur Positionierung bewegen – nicht die Hand, die fotografiert wird.</p>
                </div>
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>Sobald die Aufnahme gestartet wird, stillhalten bis das Bild angezeigt wird. </p>
                </div>
              </div>
              <p className="continue-text">Klicke auf <span >Weiter</span>, um mit der Kalibrierung zu starten.</p>
            </div>

            <button className="backButton" onClick={backButton}>Zurück</button>
            <button className="continueBttn" onClick={() => {changeCardIndex()}}>Weiter</button>
          </>
        )}
        {cardIndex === 2 && (
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
              <button className={`continueBttn ${!buttonStateLeft ? "active" : "disabled"}`} disabled={buttonStateLeft} onClick={ () => {changeCardIndex(); setCalibrationFinished(true); changeStart(); changeShowCard();changeShowCV()}}>Weiter</button>
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