import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Hands } from "@mediapipe/hands";
import "../css/hand-calibration.css";
import useCameraCapture from "./camera-capture";
import useInitializeCamera from "./useInitializeCamera";

const HandCalibration = ({ updateButtonStateLeft, updateCalSide, handSide, updateHandSide, updateButtonStateRight, updateTargetCoordsLeft, updateTargetCoordsRight, processRestart, updateProcessRestart }) => {
  const [start, setStart] = useState(true);
  const [videoSize, setVideoSize] = useState({ width: 400, height: 500 });
  const [handInPosition, setHandInPosition] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongHand, setWrongHand] = useState(false);
  const [handLabel, setHandLabel] = useState("rh");
  const [detectionConfidence, setDetectionConfidence] = useState(0.5);
  const [restarted, setRestarted] = useState(false);
  const [maxCameraRes, setMaxCameraRes] = useState({ width: 1280, height: 720 });
  const [overlayVisible, setOverlayVisible] = useState(true); // Overlay sichtbar initialisieren
  const [showLoader, setShowLoader] = useState(false);
  const [calDone, setCalDone] = useState(false);

  const maxCameraResRef = useRef(maxCameraRes);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { videoRef: videoRef2, canvasRef: canvasRef2, imageUrl, setImageUrl } = useCameraCapture();

  let lastTime = 0; // Letzter verarbeiteter Frame-Zeitstempel

  const processVideoFrame = async (hands) => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) {
      try {
        await hands.send({ image: video });
      } catch (error) {
        console.error("Fehler beim Senden an Mediapipe:", error);
      }
    }
    setTimeout(() => processVideoFrame(hands), 33); // 10 FPS (100ms pro Frame)
  };

  const { startCameraStream, initializeCamera, stopCamera: stopCameraStream } = useInitializeCamera(
    videoRef,
    setVideoSize,
    processVideoFrame
  );

  const targetPositions = useMemo(() => {
    if (handSide === "Right") {
      return [
        { x: 0.85, y: 0.4 },
        { x: 0.65, y: 0.35 },
        { x: 0.4, y: 0.37 },
        { x: 0.15, y: 0.45 },
      ];
    } else if (handSide === "Left") {
      return [
        { x: 0.15, y: 0.42 },
        { x: 0.4, y: 0.35 },
        { x: 0.63, y: 0.37 },
        { x: 0.85, y: 0.45 },
      ];
    }
  }, [handSide]);

  const tolerance = 20;
  const targetAreaSize = 80;

  const [landmarkCoordinates, setLandmarkCoordinates] = useState([]);

  const initializeHands = useCallback(() => {
    const hands = new Hands({
      locateFile: (file) => `/mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: detectionConfidence,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      if (!video || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        setHandInPosition(false);
        setWrongHand(false);
        setOverlayVisible(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (results.multiHandedness && results.multiHandedness[0].label !== handSide) {
        setWrongHand(true);
        setHandInPosition(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      } else {
        setWrongHand(false);
        setOverlayVisible(false); // Maske ausblenden, wenn die richtige Hand erkannt wurde
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const landmarks = results.multiHandLandmarks[0];
      let allFingersInPosition = true;

      const newLandmarkCoordinates = [];

      targetPositions.forEach((target, index) => {
        const fingerLandmarkIndex = [8, 12, 16, 20][index];
        const point = landmarks[fingerLandmarkIndex];
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;

        const normalizedX = x / canvas.width;
        const normalizedY = y / canvas.height;

        const fingerInPosition =
          Math.abs(x - target.x * canvas.width) <= tolerance && Math.abs(y - target.y * canvas.height) <= tolerance;

        if (!fingerInPosition) {
          allFingersInPosition = false;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.rect(target.x * canvas.width - targetAreaSize / 2, target.y * canvas.height - targetAreaSize / 2, targetAreaSize, targetAreaSize);
        ctx.strokeStyle = fingerInPosition ? "green" : "red";
        ctx.lineWidth = 2;
        ctx.stroke();

        newLandmarkCoordinates.push({ x: normalizedX, y: normalizedY });
      });

      if (allFingersInPosition && landmarkCoordinates.length === 0) {
        setLandmarkCoordinates(newLandmarkCoordinates);
        if (handSide === "Right") {
          updateTargetCoordsLeft(newLandmarkCoordinates);
          updateButtonStateLeft();
          setIsActive(false);
          setShowLoader(true);
          stopCameraStream();
          updateCalSide();
          
        };
        if(handSide === "Left") {
          updateTargetCoordsRight(newLandmarkCoordinates);
          updateButtonStateRight();
          setIsActive(false);
          setTimeout(() => {
            stopCameraStream();
            updateCalSide();
          }, 1500)
        };

        
      }

      setHandInPosition(allFingersInPosition);

      if (allFingersInPosition) {
        targetPositions.forEach((target) => {
          const targetX = target.x * canvas.width;
          const targetY = target.y * canvas.height;
          ctx.beginPath();
          ctx.rect(targetX - targetAreaSize / 2, targetY - targetAreaSize / 2, targetAreaSize, targetAreaSize);
          ctx.strokeStyle = "green";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    });

    return hands;
  }, [updateButtonStateLeft, updateButtonStateRight, updateCalSide, updateTargetCoordsLeft, updateTargetCoordsRight, detectionConfidence, handSide, targetPositions, landmarkCoordinates, stopCameraStream]);

  const startProcess = useCallback(async () => {
    setRestarted(false);
    var hands = null;

    setIsActive(true);
    setImageUrl(null);
    hands = initializeHands();
    await initializeCamera(hands);
    setTimeout(() => {
      setProcessStarted(true);
    }, 1000);
  }, [initializeCamera, initializeHands, setImageUrl]);

  const firstStart = useCallback(async () => {
    startProcess();
  }, [startProcess]);

  useEffect(() => {
    maxCameraResRef.current = maxCameraRes;

    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        setCalDone(true)
      }, 1500);
      
      return () => clearTimeout(timer); // Cleanup, falls sich der State ändert
    }

    if (start) {
      const startStream = async () => {
        const stream = await startCameraStream();
        if (stream && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setVideoSize({
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });
            videoRef.current.play();
          };
        }
      };

      const runFunctions = async () => {
        startStream();
        firstStart();
      };
      runFunctions();
      setStart(false);
    }
    if (restarted || processRestart) {
      const runFunctions = async () => {
        startProcess();
      };
      runFunctions();
      updateProcessRestart();
    }
  }, [
    showLoader,
    processRestart,
    updateProcessRestart,
    startCameraStream,
    maxCameraRes,
    maxCameraResRef,
    firstStart,
    start,
    startProcess,
    restarted,
    handLabel,
    handSide,
    imageUrl,
  ]);

  return (
    <div className="camera-view">
      <div
        className="hand-cal-camera-container"
        style={{
          width: videoSize.width,
          height: videoSize.height,
        }}
      >
        {isActive && (
          <>
            <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="camera-canvas" />
          </>
        )}
        {overlayVisible && wrongHand && (
          <div className="overlay">
            <div className="overlay-text">{handSide === "Left" ? "Rechte Hand" : "Linke Hand"}</div>
          </div>
        )}
        <video className="hidden" ref={videoRef2} style={{ display: "none" }} autoPlay muted></video>
        <canvas className="hidden" ref={canvasRef2} style={{ display: "none" }}></canvas>
       
        {!isActive && handSide === "Left" && (<> 
        <div className="loader-text">Bitte warten..</div>
        <div class="loader"></div>
        </>)}
        {!isActive && handSide === "Right" && showLoader && (<> 
          <div className="loader-text">Bitte warten..</div>
          <div class="loader"></div>
        </>)}
        {calDone && (<><div className="calDone-text1">Kalibrierung erfolgreich!</div><div className="calDone-text2">Klicke auf Weiter</div></>)}
      </div>
    </div>
  );
};

export default HandCalibration;
