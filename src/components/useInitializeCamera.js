import { useEffect, useCallback, useRef } from "react";

const useInitializeCamera = (videoRef, setVideoSize, processVideoFrame) => {
  const streamRef = useRef(null);

  const startCameraStream = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 400 }, // Maximale Auflösung für spätere Skalierung
          height: { ideal: 300 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Fehler beim Zugriff auf die Kamera:", error);
      return null;
    }
  }, []);

  const initializeCamera = useCallback(async (hands) => {
    const stream = await startCameraStream();
    if (!stream) return;
  
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      video.onloadedmetadata = async () => {
        setVideoSize({
          width: video.videoWidth,
          height: video.videoHeight,
        });
        video.play();
  
        // Erhalte den ersten Video-Track aus dem Stream
        const [videoTrack] = stream.getVideoTracks();
        if (videoTrack) {
          try {
            // Ändere die Auflösung mittels applyConstraints
            await videoTrack.applyConstraints({
              width: { ideal: 400 },
              height: { ideal: 300 }
            });
            console.log("Auflösung wurde auf 640x480 angepasst");
          } catch (err) {
            console.error("Fehler beim Anpassen der Auflösung:", err);
          }
        }
  
        // Starte die Verarbeitung der Videoframes (zum Beispiel für MediaPipe)
        setTimeout(() => {
          processVideoFrame(hands);
        }, 500);
      };
    }
  }, [videoRef, setVideoSize, processVideoFrame, startCameraStream]);
  

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { initializeCamera, stopCamera, startCameraStream };
};

export default useInitializeCamera;