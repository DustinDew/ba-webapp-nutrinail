import React, { useContext, useEffect, useState } from "react";
import "../css/dialog.css";
import HandCalibration from "./hand-calibration";
import { LanguageContext } from "../context/language-context"; // Importiere den LanguageContext

const Dialog = ({ changeShowScrollIndc, updateTargetCoordsLeft, updateTargetCoordsRight, changeScrollable, changeShowCV, changeStart, changeShowCard, changeProcessState, changeBoxVis }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [buttonStateRight, setButtonStateRight] = useState(true);
  const [buttonStateLeft, setButtonStateLeft] = useState(true);
  const [handSide, setHandSide] = useState("Left");
  const [calSide, setCalSide] = useState("Right");
  const [calibrationFinished, setCalibrationFinished] = useState(false);

  const { language } = useContext(LanguageContext); // Abrufen der aktuellen Sprache aus dem Context

  const translations = {
    de: {
      processFlow: "Prozessablauf",
      handCalibration: "Handkalibrierung",
      handCalibrationText: "Zielbereiche erscheinen auf dem Kamera-Stream, in denen sich deine Finger befinden müssen. Alles andere passiert automatisch.",
      imageCapture: "Bildaufnahme",
      imageCaptureText: "Zuerst Zeige- bis kleiner Finger, dann der Daumen. Sobald deine Finger in den Zielbereichen sind, wird automatisch ein Bild aufgenommen.",
      processCompletion: "Prozessabschluss",
      processCompletionText: "Nach der Aufnahme folgt ein kurzer Fragebogen. Damit hilfst du uns, die Daten besser zu verstehen.",
      importantForCapture: "Wichtig für die Bildaufnahme",
      rule1: "Einen flachen, gut belichteten Untergrund wählen – am besten mit natürlichem Licht.",
      rule2: "Die Hand flach auf den Untergrund legen und absolut stillhalten.",
      rule3: "Das Handy zur Positionierung bewegen – nicht die Hand, die fotografiert wird.",
      rule4: "Sobald die Aufnahme gestartet wird, stillhalten bis das Bild angezeigt wird.",
      clickNext: "Klicke auf Weiter, um mit der Aufnahme zu starten.",
      calibrationRight: "Kalibrierung Rechts",
      calibrationLeft: "Kalibrierung Links",
      calibrationSuccess: "Kalibrierung erfolgreich!",
      clickNextToContinue: "Klicke auf Weiter",
      back: "Zurück",
      next: "Weiter"
    },
    en: {
      processFlow: "Process Flow",
      handCalibration: "Hand Calibration",
      handCalibrationText: "Target areas will appear on the camera stream where your fingers need to be. Everything else happens automatically.",
      imageCapture: "Image Capture",
      imageCaptureText: "First show the index to the little finger, then the thumb. Once your fingers are in the target areas, an image will be automatically taken.",
      processCompletion: "Process Completion",
      processCompletionText: "After the capture, a short questionnaire will follow. This helps us better understand the data.",
      importantForCapture: "Important for the Image Capture",
      rule1: "Choose a flat, well-lit surface – preferably with natural light.",
      rule2: "Place your hand flat on the surface and keep still.",
      rule3: "Move the phone to position it – not the hand being photographed.",
      rule4: "Once the capture starts, keep still until the image is shown.",
      clickNext: "Click Next to start the capture.",
      calibrationRight: "Calibration Right",
      calibrationLeft: "Calibration Left",
      calibrationSuccess: "Calibration successful!",
      clickNextToContinue: "Click Next",
      back: "Back",
      next: "Next"
    }
  };

  const changeCardIndex = () => {
    if (cardIndex < 2) {
      setCardIndex(cardIndex + 1);
    }
  };

  const backButton = () => {
    if (cardIndex >= 1) {
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

  useEffect(() => {
    
  }, []);

  return (
    <div className="dialog">
      <div className="card">
        {cardIndex === 0 && (
          <>
            <h2>{translations[language].processFlow}</h2>
            <div className="process-plan">
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>{translations[language].handCalibration}</h3>
                    <p>{translations[language].handCalibrationText}</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>{translations[language].imageCapture}</h3>
                    <p>{translations[language].imageCaptureText}</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>{translations[language].processCompletion}</h3>
                    <p>{translations[language].processCompletionText}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="backButton" onClick={backButton}>{translations[language].back}</button>
            <button className={`continueBttn ${true ? "active" : "disabled"}`} onClick={ () => {changeCardIndex()}}>{translations[language].next}</button>
          </>
        )}
        {cardIndex === 1 && (
          <>
            <h2>{translations[language].importantForCapture}</h2>
            <div className="rules-container">
              <div className="rules">
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>{translations[language].rule1}</p>
                </div>
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>{translations[language].rule2}</p>
                </div>
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>{translations[language].rule3}</p>
                </div>
                <div className="rule">
                  <div className="step-number">!</div>
                  <p>{translations[language].rule4}</p>
                </div>
              </div>
              <p className="continue-text">{translations[language].clickNext}</p>
            </div>
            <button className="backButton" onClick={backButton}>{translations[language].back}</button>
            <button className="continueBttn" onClick={ () => {changeCardIndex(); setCalibrationFinished(true); changeStart(); changeShowCard(); changeShowCV()}}>{translations[language].next}</button>
          </>
        )}
        {cardIndex === 2 && (
          <>
            {!calibrationFinished ? (
              <>
                {calSide === "Right" && (
                  <>
                    <h2>{translations[language].calibrationRight}</h2>
                    <HandCalibration updateCalSide={() => setCalSide("Left")} handSide={"Left"} updateHandSide={(side) => setHandSide(side)} updateButtonStateRight={() => setButtonStateRight(false)} updateTargetCoordsLeft={(arr) => updateTargetCoordsLeft(arr)} updateTargetCoordsRight={(arr) => updateTargetCoordsRight(arr)} />
                  </>
                )}
                {calSide === "Left" && (
                  <>
                    <h2>{translations[language].calibrationLeft}</h2>
                    <HandCalibration updateCalFinished={() => setCalibrationFinished(!calibrationFinished)} handSide={"Right"} updateHandSide={(side) => setHandSide(side)} updateButtonStateLeft={() => setButtonStateLeft(false)} updateTargetCoordsLeft={(arr) => updateTargetCoordsLeft(arr)} updateTargetCoordsRight={(arr) => updateTargetCoordsRight(arr)} />
                  </>
                )}
              </>
            ) : (
              <>
                <h2>{translations[language].calibrationRight}</h2>
                <div className="loading-screen-cal-na">
                  <div className="calDone-text1-na">{translations[language].calibrationSuccess}</div>
                  <svg className="checkmark-na" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle-na" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check-na" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                  <div className="calDone-text2">{translations[language].clickNextToContinue}</div>
                </div>
              </>
            )}
            <button className="backButton" onClick={backButton}>{translations[language].back}</button>
            <button className={`continueBttn ${!buttonStateLeft ? "active" : "disabled"}`} disabled={buttonStateLeft} onClick={ () => {changeCardIndex(); setCalibrationFinished(true); changeStart(); changeShowCard(); changeShowCV()}}>{translations[language].next}</button>
          </>
        )}

        <div className="ball-row">
          <div className={`kugel ${cardIndex === 0 ? "on" : "off"}`} onClick={() => setCardIndex(0)}></div>
          <div className={`kugel ${cardIndex === 1 ? "on" : "off"}`} onClick={() => setCardIndex(1)}></div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
