import { useState, useRef, useCallback } from 'react';

const useCameraCapture = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async (width, height) => {
    
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: width, min: 720 },
          height: { ideal: height, min: 1080 },
        },
        audio: false,
      };
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Kamerazugriff fehlgeschlagen:", error);
      if (error.name === "NotReadableError") {
        console.log("Die Kamera ist derzeit nicht verfügbar. Möglicherweise wird sie von einer anderen Anwendung verwendet.");
      } else {
        console.log("Fehler beim Zugriff auf die Kamera. Bitte prüfen Sie die Berechtigungen und die Hardware.");
      }
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // bessere Kompression
      
      setImageUrl(dataUrl);
      return dataUrl;
    }

    return null;
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  }, []);

  return {
    videoRef,
    canvasRef,
    imageUrl,
    isCameraActive,
    startCamera,
    capturePhoto,
    stopCamera,
    setImageUrl,
  };
};

export default useCameraCapture;
