import { useEffect, useCallback, useRef } from "react";

const useInitializeCamera = (maxWidth, maxHeight, canvasRef, videoRef, setVideoSize, processVideoFrame) => {
  const streamRef = useRef(null);

  const startCameraStream = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: maxWidth},
          height: { ideal: maxHeight},
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Fehler beim Zugriff auf die Kamera:", error);
      return null;
    }
  }, [maxHeight, maxWidth]);

  const initializeCamera = useCallback(async (handsInstance) => {
    const stream = await startCameraStream();
    if (!stream) return;

    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;

    const onVideoReady = async () => {
      await video.play();
      const { videoWidth, videoHeight } = video;
      setVideoSize({ width: videoWidth, height: videoHeight });

      console.log("Video-Stream gestartet:", videoWidth, videoHeight);

      requestAnimationFrame(() => {
        processVideoFrame(handsInstance);
      });
    };

    video.onloadeddata = onVideoReady;
  }, [startCameraStream, videoRef, setVideoSize, processVideoFrame]);

  const stopCamera = useCallback(async () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("Video- oder Canvas-Element nicht vorhanden.");
      return null;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  }, [videoRef, canvasRef]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { initializeCamera, stopCamera, startCameraStream, capturePhoto };
};

export default useInitializeCamera;
