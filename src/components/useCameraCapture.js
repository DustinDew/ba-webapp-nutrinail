import { useState, useRef } from 'react';

const useCameraCapture = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async (width, height) => {
    
    console.log({width: width, height: height})
    try {
      const constraints = {
        video: {
          width: {ideal: width },
          height: {ideal: height },
          facingMode: 'environment',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("Fehler beim Starten der Kamera:", error);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL();
      setImageUrl(dataUrl);
      return dataUrl;
    };
    return null;
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  return {
    videoRef,
    canvasRef,
    imageUrl,
    isCameraActive,
    startCamera,
    capturePhoto,
    stopCamera,
    setImageUrl
  };
};

export default useCameraCapture;
