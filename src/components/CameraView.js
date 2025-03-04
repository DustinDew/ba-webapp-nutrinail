import React, { useMemo, useRef, useState, useEffect, useCallback} from "react";
import { Hands } from "@mediapipe/hands";
import "../css/CameraView.css";
import useCameraCapture from "./useCameraCapture";
import useInitializeCamera from "./useInitializeCamera";

const CameraView = ({ targetPositionsLeft, targetPositionsRight, start, changeStart, processRestart, updateProcessRestart }) => {

  const [videoSize, setVideoSize] = useState({ width: 400, height: 500 });
  const [handInPosition, setHandInPosition] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handSide, setHandSide] = useState("Left");
  const [wrongHand, setWrongHand] = useState(false); 
  const [handLabel, setHandLabel] = useState("rh");
  const [detectionConfidence, setDetectionConfidence] = useState(0.9);
  const [processStartCount, setProcessStartCount] = useState(0);
  const [savedImg, setSavedImg] = useState([]);
  const [restarted, setRestarted] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);
  const [maxCameraRes, setMaxCameraRes] = useState({ width: 1280, height: 720 });
  const maxCameraResRef = useRef(maxCameraRes); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    videoRef: videoRef2,
    canvasRef: canvasRef2,
    imageUrl,
    isCameraActive,
    startCamera,
    capturePhoto,
    stopCamera,
    setImageUrl,
  } = useCameraCapture();

  const processVideoFrame = async (hands) => {
    const video = videoRef.current;
    if (video && video.readyState >= 2) {
      try {
        await hands.send({ image: video });
      } catch (error) {
        console.error("Fehler beim Senden des Bildes an Mediapipe:", error);
      }
      requestAnimationFrame(() => processVideoFrame(hands));
    }
  };

  const { startCameraStream, initializeCamera, stopCamera: stopCameraStream } = useInitializeCamera(
    videoRef,
    setVideoSize,
    processVideoFrame
  );

  const tolerance = 10;
  const boxSize = 60;

  const stopProcessAndCapture = useCallback(async () => {
    if (handLabel === "rh") {
      setHandLabel("rd");
      setHandSide("Left");
      setDetectionConfidence(0.5);
    } else if (handLabel === "rd") {
      setHandLabel("lh");
      setHandSide("Right");
      setDetectionConfidence(0.9);
    } else if (handLabel === "lh") {
      setHandLabel("ld");
      setHandSide("Right");
      setDetectionConfidence(0.5);
    } else if (handLabel === "ld") {
      setHandLabel("rh");
      setHandSide("Left");
      setDetectionConfidence(0.9);
    }
  
    setIsActive(false);
    setProcessStarted(false);
    stopCameraStream();
    setIsLoading(true);
  
    if (!isCameraActive) {
      await startCamera(maxCameraResRef.current.width, maxCameraResRef.current.height);
      setTimeout(async () => {
        const capturedPhoto = await capturePhoto();
        console.log("Captured Photo:", capturedPhoto);
        if (capturedPhoto) {
          setSavedImg((prevSavedImg) => [...prevSavedImg, capturedPhoto]);
        }
        setIsLoading(false);
        stopCamera();
      }, 1000);
    } else {
      const capturedPhoto = await capturePhoto();
      console.log("Captured Photo:", capturedPhoto);
      if (capturedPhoto) {
        setSavedImg((prevSavedImg) => [...prevSavedImg, capturedPhoto]);
      }
      setIsLoading(false);
      stopCamera();
    }
  
    setTimeout(() => {
      setHandInPosition(false);
    }, 1000);
  }, [capturePhoto, handLabel, isCameraActive, startCamera, stopCamera, stopCameraStream]);

  const initializeHands = useCallback(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
  
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
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
      }
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const landmarks = results.multiHandLandmarks[0];
      let inPosition = false;
      const targetPositions = handSide === "Left" ? targetPositionsRight : targetPositionsLeft;
  
      if (handLabel === "rd" || handLabel === "ld") {
        const thumbLandmark = landmarks[4];
        const target = {
          x: canvas.width / 2,
          y: canvas.height / 2,
        };
  
        const x = thumbLandmark.x * canvas.width;
        const y = thumbLandmark.y * canvas.height;
  
        const targetX = target.x;
        const targetY = target.y;
  
        inPosition = Math.abs(x - targetX) <= tolerance && Math.abs(y - targetY) <= tolerance;
  
        if (!inPosition) {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
  
        ctx.beginPath();
        ctx.rect(targetX - boxSize / 2, targetY - boxSize / 2, boxSize, boxSize);
        ctx.strokeStyle = inPosition ? "green" : "red";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        let allFingersInPosition = true;
        targetPositions.forEach((target, index) => {
          const fingerLandmarkIndex = [8, 12, 16, 20][index];
          const point = landmarks[fingerLandmarkIndex];
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;
  
          const targetX = target.x * canvas.width;
          const targetY = target.y * canvas.height;
  
          const fingerInPosition = Math.abs(x - targetX) <= tolerance && Math.abs(y - targetY) <= tolerance;
  
          if (!fingerInPosition) {
            allFingersInPosition = false;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          }
  
          ctx.beginPath();
          ctx.rect(targetX - boxSize / 2, targetY - boxSize / 2, boxSize, boxSize);
          ctx.strokeStyle = fingerInPosition ? "green" : "red";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
  
        inPosition = allFingersInPosition;
      }
  
      setHandInPosition(inPosition);
  
      if (inPosition) {
        stopProcessAndCapture();
      }
    });
  
    return hands;
  }, [detectionConfidence, handLabel, handSide, stopProcessAndCapture, targetPositionsLeft, targetPositionsRight]);

  const startProcess = useCallback(async () => {
    setRestarted(false);
    var hands = null;
    if (processStartCount >= 4) {
      setProcessStartCount(0);
      alert("Danke für die Teilnahme!");
      setProcessFinished(true);
      return;
    } else {
      setProcessStartCount(processStartCount + 1);
    }

    setIsActive(true);
    setImageUrl(null);
    hands = initializeHands();
    await initializeCamera(hands);
    setTimeout(() => {
      setProcessStarted(true);
    }, 1000);
  }, [videoRef, savedImg, initializeCamera, initializeHands, processStartCount, restarted, setImageUrl]);

  const firstStart = useCallback( async () => {
    startProcess();
  }, [startProcess]);

  const repeatCapture = () => {
    if (handLabel === "rd") {
      setHandLabel("rh");
      setHandSide("Left");
    } else if (handLabel === "lh") {
      setHandLabel("rd");
      setHandSide("Left");
    } else if (handLabel === "ld") {
      setHandLabel("lh");
      setHandSide("Right");
    } else if (handLabel === "rh") {
      setHandLabel("ld");
      setHandSide("Right");
    }
    const imgArray = savedImg;
    imgArray.pop();
    setSavedImg(imgArray);
    setRestarted(true);
  };

  const getMaxCameraResolution = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      let highestResolution = { width: 0, height: 0 };

      for (const device of videoDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId }
        });
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();

        if (capabilities.width && capabilities.height) {
          if (capabilities.width.max > highestResolution.width) {
            highestResolution = {
              width: capabilities.width.max,
              height: capabilities.height.max
            };
          }
        }

        stream.getTracks().forEach(track => track.stop());
      }
      setMaxCameraRes({ width: highestResolution.width, height: highestResolution.height });
      return highestResolution;
    } catch (error) {
      console.error('Error accessing camera devices:', error);
      return null;
    }
  };

  useEffect(() => {
    maxCameraResRef.current = maxCameraRes;

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

      const maxCameraRes = async () => { await getMaxCameraResolution() };
      const runFunctions = async () => {
        await maxCameraRes();
        startStream();
        firstStart();
      };
      runFunctions();
      changeStart();
    }

    if (restarted || processRestart) {
      const maxCameraRes = async () => { await getMaxCameraResolution() };
      const runFunctions = async () => {
        await maxCameraRes();
        startProcess();
      };
      runFunctions();
      updateProcessRestart();
    };

  }, [targetPositionsRight, startCameraStream, maxCameraRes, maxCameraResRef, processRestart, updateProcessRestart, firstStart, changeStart, start, startProcess, restarted, handLabel, handSide, savedImg, imageUrl]);

  return (
    <div className="camera-view">
      {/* Wrapper für Card-Hintergrund */}
      <div className="camera-card">
        <div className="progress-bar">
          <div className={`progress-square-1 ${savedImg.length >= 1 ? "active" : "off"}`}>
            {savedImg.length >= 1 ? (<>&#10003;</>) : (<>&#10008;</>)}
          </div>
          <div className="progress-line-off"></div>
          <div className={`progress-line ${savedImg.length >= 2 ? "active" : "off"}`}></div>
          <div className={`progress-square ${savedImg.length >= 2 ? "active" : "off"}`}>
            {savedImg.length >= 2 ? (<>&#10003;</>) : (<>&#10008;</>)}
          </div>
          <div className="progress-line-off"></div>
          <div className={`progress-line ${savedImg.length >= 3 ? "active" : "off"}`}></div>
          <div className={`progress-square ${savedImg.length >= 3 ? "active" : "off"}`}>
            {savedImg.length >= 3 ? (<>&#10003;</>) : (<>&#10008;</>)}
          </div>
          <div className="progress-line-off"></div>
          <div className={`progress-line ${savedImg.length >= 4 ? "active" : "off"}`}></div>
          <div className={`progress-square ${savedImg.length === 4 ? "active" : "off"}`}>
            {savedImg.length === 4 ? (<>&#10003;</>) : (<>&#10008;</>)}
          </div>
        </div>
        {/* Kamera-Container */}
        <div
          className="camera-container"
          style={{
            width: videoSize.width,
            height: videoSize.height,
          }}
        >
          {isActive && (
            <>
              <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="camera-canvas" />

              

              {/* Feedback-Element */}
              {processStarted && (
                <div className="feedback">
                  {handLabel === "rd" && <p>Rechter Daumen</p>}
                  {handLabel === "ld" && <p>Linker Daumen</p>}
                  {handLabel === "rh" && <p>Rechte Hand</p>}
                  {handLabel === "lh" && <p>Linke Hand</p>}
                  {wrongHand ? (
                    <p style={{ color: "red", fontSize: "14px" }}>Bitte Hand wechseln</p>
                  ) : handInPosition ? (
                    <p style={{ color: "green" }}>Alle Finger in der richtigen Position!</p>
                  ) : null}
                </div>
              )}
              
            </>
          )}
          {isLoading && (
            <div className="loading-screen"> 
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          )}
          {/* Unsichtbares Video und Canvas für Hintergrundverarbeitung */}
          <video className="hidden" ref={videoRef2} style={{ display: "none" }} autoPlay muted></video>
          <canvas className="hidden" ref={canvasRef2} style={{ display: "none" }}></canvas>

          {/* Fotoanzeige nach Aufnahme */}
        
        </div>
        
        {!isLoading && imageUrl && (
          <>
            <div className="captured-image-container">
              
              <img src={imageUrl} alt="Captured" />
            </div>
            
            {!handInPosition && (
              <div className="controls">
              
              {processStartCount >= 1 && !isActive && (
                <>
                  <div className="button-row">
                    
                    <button className="repeatButton" onClick={repeatCapture}>
                      Wiederholen
                    </button>
                    <button className="continueButton" onClick={startProcess}>
                      Weiter
                    </button>
                  </div>
                </>
                )}
              {processFinished && (
                <>
                  <button className="repeatButton" onClick={repeatCapture}>
                      Wiederholen
                  </button>
                </>
              )}
              </div>
            )}
          </>
        )}
        {/*<button className="position-button" onClick={() => stopProcessAndCapture()}>Aufnahme</button>*/}
      </div>
    </div>
  );

};

export default CameraView;
