import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, X } from 'lucide-react';
import { captureVideoFrame } from './imageUtils';

/**
 * Live camera preview with a capture button, for the Virtual Try-On page.
 *
 * Only mounted after the visitor clicks an "Open camera" style button, so the
 * camera never starts on its own. Every track is stopped as soon as a photo is
 * taken, when the visitor closes it, and on unmount.
 *
 *   facingMode  'user' (front) | 'environment' (back). Requested as `ideal`,
 *               so desktops without that camera fall back to their default one.
 *   mirrored    mirror the preview, and flip the capture to match it
 *   countdown   seconds of 3-2-1 countdown before capture (0 = immediate)
 */

const cameraErrorMessage = (err) => {
  switch (err && err.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera access was blocked. Allow camera access in your browser settings, or upload a photo instead.';
    case 'NotFoundError':
    case 'OverconstrainedError':
    case 'DevicesNotFoundError':
      return "We couldn't find a camera on this device. Upload a photo instead.";
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Your camera is being used by another app. Close it and try again, or upload a photo instead.';
    default:
      return "Couldn't start the camera. Upload a photo instead.";
  }
};

const CameraCapture = ({
  facingMode = 'user',
  mirrored = false,
  countdown = 0,
  hint,
  captureLabel = 'Take photo',
  onCapture,
  onClose,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const [status, setStatus] = useState('starting'); // starting | live | error
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  const stopCamera = useCallback(() => {
    clearTimeout(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!window.isSecureContext) {
        setError('The camera only works on a secure (https) connection. Upload a photo instead.');
        setStatus('error');
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("This browser can't open the camera. Upload a photo instead.");
        setStatus('error');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play().catch(() => {});
        setStatus('live');
      } catch (err) {
        if (!cancelled) {
          setError(cameraErrorMessage(err));
          setStatus('error');
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [facingMode, stopCamera]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    try {
      const blob = await captureVideoFrame(video, { mirror: mirrored });
      stopCamera();
      onCapture(blob);
    } catch (err) {
      setError(err.message);
      setStatus('error');
      stopCamera();
    }
  }, [mirrored, onCapture, stopCamera]);

  const startCapture = () => {
    if (!countdown) {
      capture();
      return;
    }
    const tick = (n) => {
      setCount(n);
      if (n === 0) {
        capture();
        return;
      }
      timerRef.current = setTimeout(() => tick(n - 1), 1000);
    };
    tick(countdown);
  };

  const counting = count > 0;

  return (
    <div className="vtryon-camera">
      {hint && status !== 'error' && <p className="vtryon-hint">{hint}</p>}

      <div className="vtryon-camera-frame" hidden={status === 'error'}>
        <video
          ref={videoRef}
          className={mirrored ? 'vtryon-video is-mirrored' : 'vtryon-video'}
          playsInline
          muted
          autoPlay
          aria-label="Live camera preview"
        />
        {status === 'starting' && <div className="vtryon-camera-msg">Starting camera…</div>}
        {counting && (
          <div className="vtryon-countdown" aria-hidden="true">
            {count}
          </div>
        )}
      </div>
      <p className="vtryon-sr" aria-live="polite">
        {counting ? `Taking photo in ${count}` : status === 'live' ? 'Camera is on.' : ''}
      </p>

      {status === 'error' && (
        <div className="vtryon-alert is-error" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="vtryon-actions">
        {status !== 'error' && (
          <button
            type="button"
            className="vtryon-btn vtryon-btn-primary"
            onClick={startCapture}
            disabled={status !== 'live' || counting}
          >
            <Camera size={18} aria-hidden="true" /> {counting ? `${count}…` : captureLabel}
          </button>
        )}
        <button
          type="button"
          className="vtryon-btn vtryon-btn-ghost"
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          <X size={18} aria-hidden="true" /> Close camera
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
