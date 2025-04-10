import { Hands } from "@mediapipe/hands";

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
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.5,
        });

        // Funktion, die ausgeführt wird, wenn Ergebnisse vorliegen
        hands.onResults((results) => {
          try {
            // Sicherstellen, dass multiHandLandmarks existiert und ein Array ist
            if (results && results.multiHandLandmarks && Array.isArray(results.multiHandLandmarks)) {
              if (results.multiHandLandmarks.length > 0) {
                alert("Hand erkannt");
                resolve(true);  // Hand erkannt
              } else {
                alert("Keine Hand erkannt");
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
