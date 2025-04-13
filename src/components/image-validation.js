import { Hands } from "@mediapipe/hands";
import "../css/validation.css";
import { useContext } from "react";
import { LanguageContext } from "../context/language-context"; // Context importieren

export const runHandDetection = (dataUrl) => {
  return new Promise((resolve, reject) => {
    // Bild-Tag erstellen
    const img = new Image();

    // Bild wird geladen
    img.onload = () => {
      try {
        // Canvas zum Skalieren des Bildes erstellen
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Neue Bilddimensionen (du kannst die Werte anpassen)
        const maxWidth = 640;
        const maxHeight = 480;

        // Berechnung der Skalierung
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Bild auf Canvas zeichnen
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Hands initialisieren
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,  // Nur eine Hand erkennen
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        // Funktion, die ausgeführt wird, wenn Ergebnisse vorliegen
        hands.onResults((results) => {
          try {
            // Sicherstellen, dass multiHandLandmarks existiert und ein Array ist
            if (results && results.multiHandLandmarks && Array.isArray(results.multiHandLandmarks)) {
              if (results.multiHandLandmarks.length > 0) {
                resolve(true);  // Hand erkannt
              } else {
                resolve(false); // Keine Hand erkannt
              }
            } else {
              console.log("Fehler: multiHandLandmarks nicht verfügbar");
              resolve(false); // Fallback für Fehlerfall
            }
          } catch (error) {
            console.error("Fehler bei der Handerkennung:", error);
            reject("Fehler bei der Handerkennung");
          }
        });

        // Handerkennung starten
        hands.send({ image: canvas });  // Skalierte Canvas an Hands übergeben
      } catch (error) {
        console.error("Fehler bei der Initialisierung der Handerkennung:", error);
        reject("Fehler bei der Initialisierung der Handerkennung");
      }
    };

    img.onerror = (error) => {
      console.error("Fehler beim Laden des Bildes:", error);
      reject("Fehler beim Laden des Bildes");
    };

    // DataURL in das Bild setzen
    img.src = dataUrl;
  });


};

const Validation = ({ validated, failed }) => {
  const { language } = useContext(LanguageContext); // Sprachauswahl aus dem Kontext

  const translations = {
    de: {
      retry: "Bitte Wiederholen",
      success: "Super! Das Bild passt.",
      checking: "Bild wird geprüft...",
    },
    en: {
      retry: "Please Repeat",
      success: "Great! The image is good.",
      checking: "Checking image...",
    }
  };

  const t = translations[language]; // Dynamische Auswahl der Übersetzungen

  return (
    <div className="val-container"> 
      {failed ? (
        <div className="wrapper">
          <svg className="error-icon" viewBox="0 0 52 52">
            <circle className="error-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="error-cross" d="M16 16 L36 36 M36 16 L16 36" />
          </svg>
          <p>{t.retry}</p>
        </div>
      ) : (
        <>
          {validated ? (
            <div className="wrapper"> 
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
              <p>{t.success}</p>
            </div>
          ) : (
            <div className="wrapper">
              <div className="loader"></div>
              <p>{t.checking}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Validation;