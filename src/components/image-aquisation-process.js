import React, { useContext, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Hands } from "@mediapipe/hands";
import "../css/CameraView.css";
import CameraCapture from "./camera-capture";
import useInitializeCamera from "./useInitializeCamera";
import Validation, { runHandDetection } from "./image-validation";
import ProgressBar from "./progress-bar";
import { LanguageContext } from "../context/language-context"; // Hier wird der Kontext verwendet

const ImageAquisation = ({ updateFinished, start, changeStart, processRestart, updateProcessRestart }) => {
  const [, setVideoSize] = useState({ width: 400, height: 500 });
  const [handInPosition, setHandInPosition] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [isLoading] = useState(false);
  const [handSide, setHandSide] = useState("Right");
  const [, setWrongHand] = useState(false);
  const [handLabel, setHandLabel] = useState("lh");
  const [processStartCount, setProcessStartCount] = useState(0);
  const [savedImg, setSavedImg] = useState([]);
  const [restarted, setRestarted] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);
  const [maxCameraRes] = useState({ width: 1440, height: 1080 });
  const [showOverlay, setShowOverlay] = useState(true);
  const [validated, setValidated] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [valFail, setValFail] = useState(false);

  const maxCameraResRef = useRef(maxCameraRes);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
 
  const translations = {
    en: {
      rightThumb: "Right Thumb",
      leftThumb: "Left Thumb",
      rightHand: "Right Hand",
      leftHand: "Left Hand",
      captureSuccess: "Capture successful!",
      repeat: "Repeat",
      continue: "Continue",
      loadingText: "Capture successful!",
    },
    de: {
      rightThumb: "Rechter Daumen",
      leftThumb: "Linker Daumen",
      rightHand: "Rechte Hand",
      leftHand: "Linke Hand",
      captureSuccess: "Aufnahme erfolgreich!",
      repeat: "Wiederholen",
      continue: "Weiter",
      loadingText: "Aufnahme erfolgreich!",
    },
  };
  const { language } = useContext(LanguageContext); // Hole die Sprache aus dem Context
  const t = translations[language];
  

  const translate = (key) => {
    return translations[language][key] || key;  // Gib den übersetzten Text zurück, falls vorhanden
  };

  const targetPositions = useMemo(() => {
    if (handSide === "Right") {
      return [
        { x: 0.86, y: 0.35 },
        { x: 0.63, y: 0.3 },
        { x: 0.4, y: 0.32 },
        { x: 0.15, y: 0.40 },
      ];
    } else if (handSide === "Left") {
      return [
        { x: 0.15, y: 0.37 },
        { x: 0.4, y: 0.3 },
        { x: 0.63, y: 0.32 },
        { x: 0.85, y: 0.4 },
      ];
    }
  }, [handSide]);

  const processVideoFrame = useCallback(async (hands) => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) {
      try {
        await hands.send({ image: video });
      } catch (error) {
        console.error("Fehler beim Senden des Bildes an Mediapipe:", error);
      }
      requestAnimationFrame(() => processVideoFrame(hands));
    }
  });
  const {
    canvasRef: canvasRef2,
    stopCamera,
  } = CameraCapture();

  const { startCameraStream, initializeCamera, stopCamera: stopCameraStream, capturePhoto } = useInitializeCamera(maxCameraResRef.current.width, maxCameraResRef.current.height, canvasRef2, videoRef, setVideoSize, useCallback(async (hands) => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) {
      try {
        await hands.send({ image: video });
      } catch (error) {
        console.error("Fehler beim Senden des Bildes an Mediapipe:", error);
      }
      requestAnimationFrame(() => processVideoFrame(hands));
    }
  }, [processVideoFrame]));

  const stopProcessAndCapture = useCallback(async () => {
    const nextHand = {
      lh: { label: "ld", side: "Right" },
      ld: { label: "rh", side: "Left" },
      rh: { label: "rd", side: "Left" },
      rd: { label: "lh", side: "Right" },
    }[handLabel];

    setHandLabel(nextHand.label);
    setHandSide(nextHand.side);

    const photo = await capturePhoto();
    if (photo) setSavedImg(prev => [...prev, photo]);
    setImageUrl(photo);
    stopCameraStream();
    setHandInPosition(false);
    setIsActive(false);
  }, [capturePhoto, handLabel, stopCameraStream]);

  const initializeHands = useCallback(() => {
    const hands = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });
  
    const initialTolerance = 100;
    const finalTolerance = 50;
  
    const fingerState = [
      { locked: false, tolerance: initialTolerance, target: { ...targetPositions[0] } },
      { locked: false, tolerance: initialTolerance, target: { ...targetPositions[1] } },
      { locked: false, tolerance: initialTolerance, target: { ...targetPositions[2] } },
      { locked: false, tolerance: initialTolerance, target: { ...targetPositions[3] } },
      { locked: false, tolerance: initialTolerance, target: { ...targetPositions[4] } }, // Daumen hinzugefügt
    ];
  
    let targetsLocked = false;
    let captureTimeout;
  
    hands.onResults(results => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;
  
      if (!video || !results.multiHandLandmarks?.length) {
        setHandInPosition(false);
        setWrongHand(false);
        setShowOverlay(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
  
      if (results.multiHandedness?.[0].label !== handSide) {
        setWrongHand(true);
        setHandInPosition(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
  
      setWrongHand(false);
      setShowOverlay(false);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const landmarks = results.multiHandLandmarks[0];
      let inPosition = false;
  
      // Überprüfen und Zeichnen des Zielkreises für den Daumen
      if (["rd", "ld"].includes(handLabel)) {
        const { x, y } = landmarks[4]; // Daumen
        const px = x * canvas.width;
        const py = y * canvas.height;
        const targetX = canvas.width / 2;
        const targetY = canvas.height / 2;
  
        let tolerance = fingerState[4].tolerance; // Toleranz für den Daumen
        ctx.beginPath();
        ctx.arc(targetX, targetY, tolerance, 0, 2 * Math.PI); // Daumen Zielkreis
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 2;
        ctx.stroke();
  
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, 2 * Math.PI);
        ctx.fillStyle = Math.abs(px - targetX) <= tolerance && Math.abs(py - targetY) <= tolerance ? "green" : "red";
        ctx.fill();
  
        // Toleranz für den Daumen anpassen, wenn er in Position ist
        if (Math.abs(px - targetX) <= tolerance && Math.abs(py - targetY) <= tolerance) {
          fingerState[4].tolerance = finalTolerance;
        }
  
        inPosition = Math.abs(px - targetX) <= tolerance && Math.abs(py - targetY) <= tolerance;
      } else {
        const fingers = [8, 12, 16, 20];
        const currentCheck = fingers.map((idx, i) => {
          const { x, y } = landmarks[idx];
          const px = x * canvas.width;
          const py = y * canvas.height;
  
          const state = fingerState[i];
          const tx = state.target.x * canvas.width;
          const ty = state.target.y * canvas.height;
  
          let tolerance = state.tolerance; // Dynamische Toleranz für die Finger
          const inTarget = Math.abs(px - tx) <= tolerance && Math.abs(py - ty) <= tolerance;
  
          // Zeichne Ziel (Verkleinert je nachdem ob der Finger in Position ist)
          ctx.beginPath();
          ctx.arc(tx, ty, tolerance, 0, 2 * Math.PI); // Dynamischer Zielkreis
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.lineWidth = 2;
          ctx.stroke();
  
          // Zeichne Finger
          ctx.beginPath();
          ctx.arc(px, py, 20, 0, 2 * Math.PI);
          ctx.fillStyle = inTarget ? "green" : "red";
          ctx.fill();
  
          return {
            inInitialZone: Math.abs(px - tx) <= initialTolerance && Math.abs(py - ty) <= initialTolerance,
            currentX: x,
            currentY: y,
          };
        });
  
        // Wenn alle gleichzeitig im initialen Bereich und noch nicht gelockt
        if (!targetsLocked && currentCheck.every(c => c.inInitialZone)) {
          currentCheck.forEach((c, i) => {
            fingerState[i].locked = true;
            fingerState[i].target = { x: c.currentX, y: c.currentY };
            fingerState[i].tolerance = finalTolerance;
          });
          targetsLocked = true;
        }
  
        // Danach prüfen, ob alle in ihrem (nun gelockten) finalen Bereich sind
        const allInFinalZone = fingers.every((idx, i) => {
          const { x, y } = landmarks[idx];
          const px = x * canvas.width;
          const py = y * canvas.height;
          const state = fingerState[i];
          const tx = state.target.x * canvas.width;
          const ty = state.target.y * canvas.height;
          return Math.abs(px - tx) <= state.tolerance && Math.abs(py - ty) <= state.tolerance;
        });
  
        inPosition = allInFinalZone;
      }
  
      setHandInPosition(inPosition);
      if (inPosition) {
        // Setze den Timeout nur, wenn alle Finger in Position sind und das Bild noch nicht aufgenommen wurde
        if (!captureTimeout && inPosition) {
          captureTimeout = setTimeout(() => {
            fingerState.forEach(state => {
              state.locked = false;
              state.tolerance = initialTolerance;
            });
            targetsLocked = false;
            stopProcessAndCapture();
          }, 1000); // Warte 1 Sekunde, bevor das Bild aufgenommen wird
        }
      } else {
        // Wenn die Hand nicht in Position ist, setze den Timeout zurück
        if (captureTimeout) {
          clearTimeout(captureTimeout);
          captureTimeout = null;
        }
      }
    });
  
    return hands;
  }, [handLabel, handSide, stopProcessAndCapture, targetPositions]);
  
  

  const startProcess = useCallback(async () => {
    setValidated(false);
    setValFail(false);
    setRestarted(false);
    if (processStartCount >= 4) {
      setProcessStartCount(0);
      setProcessFinished(true);
      stopCamera();
      updateFinished();
      return;
    }
    setProcessStartCount(prev => prev + 1);
    setIsActive(true);
    setImageUrl(null);
    const hands = initializeHands();
    await initializeCamera(hands);
    setTimeout(() => setProcessStarted(true), 1000);
  }, [updateFinished, stopCamera, initializeCamera, initializeHands, processStartCount, setImageUrl]);

  const firstStart = useCallback(() => startProcess(), [startProcess]);

  const repeatCapture = () => {
    const next = {
      rd: { label: "rh", side: "Left" },
      lh: { label: "rd", side: "Left" },
      ld: { label: "lh", side: "Right" },
      rh: { label: "ld", side: "Right" },
    }[handLabel];
    setHandLabel(next.label);
    setHandSide(next.side);
    setSavedImg(imgs => imgs.slice(0, -1));
    setProcessStartCount(count => count - 1);
    setRestarted(true);
    setValFail(false);
  };

  useEffect(() => {
    if (!imageUrl) return;
    const handleDetection = async () => {
      try {
        const detected = await runHandDetection(imageUrl);
        if (detected) setTimeout(() => setValidated(true), 1000);
        else {
          setValidated(false);
          setValFail(true);
        };
      } catch (e) {
        console.error("Fehler bei der Handerkennung:", e);
      }
    };
    handleDetection();
  }, [imageUrl]);

  useEffect(() => {
    maxCameraResRef.current = maxCameraRes;
    const init = async () => {
     
      const stream = await startCameraStream();
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setVideoSize({ width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
          videoRef.current.play();
        };
      }
      await firstStart();
    };
    if (start) {
      init();
      changeStart();
    } else if (restarted || processRestart) {
      startProcess();
      updateProcessRestart();
    }
  }, [start, restarted, processRestart, maxCameraRes, startCameraStream, firstStart, changeStart, startProcess, updateProcessRestart]);

  return (
    <div className="camera-view">
      <div className="camera-card">
        <ProgressBar index={savedImg.length}/>
        <div className="camera-container">
          {isActive && (
            <>
              <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="camera-canvas" style={{ transform: 'translateZ(0)' }} />

              {/* Feedback Overlay */}
              
              {processStarted && showOverlay && (
                <div className="feedback-overlay">
                  <div className="feedback2">
                    {handLabel === "rd" && <p>{t.rightThumb}</p>}
                    {handLabel === "ld" && <p>{t.leftThumb}</p>}
                    {handLabel === "rh" && <p>{t.rightHand}</p>}
                    {handLabel === "lh" && <p>{t.leftHand}</p>}
                  </div>
                </div>
              )}
            </>
          )}
  
          {/* Unsichtbares Video und Canvas für Hintergrundverarbeitung */}
          <canvas className="hidden" ref={canvasRef2} style={{ display: "none" }}></canvas>
        </div>
  
        {/* Weitere UI-Elemente */}
        {!isLoading && imageUrl && (
          <>
            <div id="val-wrapper">
              <div className="captured-image-container">
                <img src={imageUrl} alt="Captured" />
              </div>
              
             <div id="validation"><Validation failed={valFail} validated={validated}/></div>
            </div>
            {!handInPosition && (
              <div className="controls">
                {processStartCount >= 1 && !isActive && (
                  <>
                    <div className="button-row">
                      <button className="repeatButton" onClick={repeatCapture}>
                        {t.repeat}
                      </button>
                      <button disabled={!validated} className={`continueButton ${validated ? "active" : "disabled"}`} onClick={startProcess}>
                        {t.continue}
                      </button>
                    </div>
                  </>
                )}
                {processFinished && (
                  <button className="repeatButton" onClick={repeatCapture}>
                    {t.repeat}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageAquisation;
