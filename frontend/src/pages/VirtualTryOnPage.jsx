import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Camera,
  Download,
  Eye,
  RefreshCw,
  Shirt,
  Sparkles,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import CameraCapture from '../components/virtualtryon/CameraCapture';
import css from '../components/virtualtryon/styles';
import {
  GARMENT_MAX_SIDE,
  PERSON_MAX_SIDE,
  fetchGarmentImage,
  prefersReducedMotion,
  prepareForUpload,
} from '../components/virtualtryon/imageUtils';
import { API_BASE_URL } from '../services/api';
import { applySEO } from '../utils/seo';

/**
 * /virtualtryon — photo virtual try-on (SkillKoder product).
 *
 *   1. The cloth   camera (back), upload, or ?garment=<image URL>&slot=<slot>
 *   2. The person  camera (front, mirrored, 3-2-1 countdown) or upload
 *   3. Try it on   POST /api/v1/virtualtryon/ → PNG (a little over a minute)
 *   4. Result      hold-to-compare, download, try another cloth, retake
 *
 * The Django backend proxies to a self-hosted CatVTON GPU server and holds the
 * API key; this page only ever talks to our own API. Photos stay in memory as
 * Blobs and are never stored.
 */

const SLOTS = [
  { value: 'top', label: 'Top' },
  { value: 'outerwear', label: 'Jacket' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'dress', label: 'Dress' },
];
const SLOT_VALUES = SLOTS.map((s) => s.value);

const OFFLINE_MESSAGE = 'Virtual try-on is offline right now. Please try again later.';
const PRIVACY_LINE = "Your photo is only used to create this preview and isn't stored.";

/** Object URL for a Blob, revoked automatically when the Blob changes or on unmount. */
function useObjectUrl(blob) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return undefined;
    }
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}

const StepHead = ({ n, done, title, sub }) => (
  <div className="vtryon-step-head">
    <span className={done ? 'vtryon-step-num is-done' : 'vtryon-step-num'} aria-hidden="true">
      {n}
    </span>
    <div>
      <h2>
        <span className="vtryon-sr">Step {n}: </span>
        {title}
      </h2>
      {sub && <p>{sub}</p>}
    </div>
  </div>
);

const ErrorAlert = ({ children }) => (
  <div className="vtryon-alert is-error" role="alert">
    <AlertCircle size={20} aria-hidden="true" />
    <span>{children}</span>
  </div>
);

/** A real button that triggers a visually hidden, labelled file input. */
const UploadButton = ({ id, label, onFile, ghost = true }) => {
  const inputRef = useRef(null);
  return (
    <>
      <label htmlFor={id} className="vtryon-sr">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="vtryon-sr"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          e.target.value = ''; // allow choosing the same file again
          if (file) onFile(file);
        }}
      />
      <button
        type="button"
        className={ghost ? 'vtryon-btn vtryon-btn-ghost' : 'vtryon-btn vtryon-btn-primary'}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <Upload size={18} aria-hidden="true" /> {label}
      </button>
    </>
  );
};

const VirtualTryOnPage = () => {
  const [searchParams] = useSearchParams();
  const garmentParam = searchParams.get('garment');
  const slotParam = (searchParams.get('slot') || '').toLowerCase();

  const [health, setHealth] = useState('checking'); // checking | ready | busy | offline
  const [garment, setGarment] = useState(null);
  const [garmentLoading, setGarmentLoading] = useState(Boolean(garmentParam));
  const [garmentError, setGarmentError] = useState('');
  // The server answers 422 when the item chosen under "Which item?" can't be
  // found in the garment photo (e.g. "Top" for a photo that only shows trousers).
  // The message stays next to the garment preview until the visitor picks a
  // different item or photo; their own photo is kept.
  const [itemNotFound, setItemNotFound] = useState(false);
  const [slot, setSlot] = useState(SLOT_VALUES.includes(slotParam) ? slotParam : 'top');
  const [person, setPerson] = useState(null);
  const [personError, setPersonError] = useState('');
  const [camera, setCamera] = useState(null); // null | 'garment' | 'person'
  const [phase, setPhase] = useState('idle'); // idle | loading | done
  const [result, setResult] = useState(null);
  const [tryError, setTryError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [showBefore, setShowBefore] = useState(false);

  const garmentUrl = useObjectUrl(garment);
  const personUrl = useObjectUrl(person);
  const resultUrl = useObjectUrl(result);

  const abortRef = useRef(null);
  const slotsRef = useRef(null);
  const stepOneRef = useRef(null);
  const stepTwoRef = useRef(null);
  const resultRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  };

  // ---------------------------------------------------------------- setup
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/virtualtryon');
  }, []);

  const checkHealth = useCallback(async () => {
    setHealth('checking');
    try {
      const res = await fetch(`${API_BASE_URL}/virtualtryon/health/`, { cache: 'no-store' });
      const data = await res.json();
      if (!data.ready) setHealth('offline');
      else setHealth(data.busy ? 'busy' : 'ready');
    } catch {
      setHealth('offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Product pages link here with ?garment=<image URL>&slot=<slot>.
  useEffect(() => {
    if (!garmentParam) return undefined;
    let cancelled = false;
    setGarmentLoading(true);
    fetchGarmentImage(garmentParam)
      .then((blob) => !cancelled && setGarment(blob))
      .catch((err) => !cancelled && setGarmentError(err.message))
      .finally(() => !cancelled && setGarmentLoading(false));
    return () => {
      cancelled = true;
    };
  }, [garmentParam]);

  // Cancel an in-flight try-on if the visitor leaves the page.
  useEffect(() => () => abortRef.current && abortRef.current.abort(), []);

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    setElapsed(0);
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Wait for the result's object URL too: the card only renders once it exists,
  // so scrolling on `phase` alone would run before there is anything to scroll to.
  useEffect(() => {
    if (phase === 'done' && resultUrl) scrollTo(resultRef);
  }, [phase, resultUrl]);

  // After a 422, send the visitor back to step 1 with "Which item?" focused.
  useEffect(() => {
    if (!itemNotFound) return;
    scrollTo(stepOneRef);
    const checked = slotsRef.current && slotsRef.current.querySelector('input:checked');
    if (checked) checked.focus({ preventScroll: true });
  }, [itemNotFound]);

  // -------------------------------------------------------------- inputs
  const acceptFile = (file, setter, setError) => {
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image. Choose a JPG or PNG photo.');
      return;
    }
    setError('');
    setter(file);
  };

  const chooseGarment = useCallback((blob) => {
    setGarmentError('');
    setItemNotFound(false);
    setGarment(blob);
  }, []);

  const onGarmentCaptured = useCallback(
    (blob) => {
      chooseGarment(blob);
      setCamera(null);
    },
    [chooseGarment]
  );

  const onPersonCaptured = useCallback((blob) => {
    setPersonError('');
    setPerson(blob);
    setCamera(null);
  }, []);

  const clearResult = () => {
    setResult(null);
    setTryError('');
    setShowBefore(false);
    if (phase === 'done') setPhase('idle');
  };

  // -------------------------------------------------------------- try-on
  const offline = health === 'offline';
  const loading = phase === 'loading';
  const canTry = Boolean(garment && person && slot) && !itemNotFound && !offline && !loading;
  const showGarmentPicker = !garmentLoading && !garment;

  const tryOn = async () => {
    if (!canTry) return;
    setCamera(null);
    setTryError('');
    setResult(null);
    setShowBefore(false);
    setPhase('loading');

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const [personJpeg, garmentJpeg] = await Promise.all([
        prepareForUpload(person, PERSON_MAX_SIDE),
        prepareForUpload(garment, GARMENT_MAX_SIDE),
      ]);
      const form = new FormData();
      form.append('person', personJpeg, 'person.jpg');
      form.append('garment', garmentJpeg, 'garment.jpg');
      form.append('slot', slot);

      let res;
      try {
        res = await fetch(`${API_BASE_URL}/virtualtryon/`, {
          method: 'POST',
          body: form,
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name === 'AbortError') throw err;
        setHealth('offline');
        throw new Error(OFFLINE_MESSAGE);
      }

      if (!res.ok) {
        let message = '';
        try {
          message = (await res.json()).error;
        } catch {
          /* non-JSON error body */
        }
        if (res.status === 422) {
          setGarmentError(
            message ||
              "Couldn't find that item in the garment photo. Pick a different item under \"Which item?\", or use another photo."
          );
          setItemNotFound(true);
          setPhase('idle');
          return;
        }
        if (res.status === 503 && message === OFFLINE_MESSAGE) setHealth('offline');
        throw new Error(message || 'Virtual try-on failed. Please try again.');
      }

      setResult(await res.blob());
      setPhase('done');
    } catch (err) {
      setPhase('idle');
      if (err.name !== 'AbortError') setTryError(err.message || 'Virtual try-on failed. Please try again.');
    } finally {
      abortRef.current = null;
    }
  };

  const cancelTryOn = () => abortRef.current && abortRef.current.abort();

  const tryAnotherCloth = () => {
    clearResult();
    setPhase('idle');
    setGarment(null);
    setGarmentError('');
    setItemNotFound(false);
    setCamera(null);
    scrollTo(stepOneRef);
  };

  const retakePerson = () => {
    clearResult();
    setPhase('idle');
    setPerson(null);
    setPersonError('');
    setCamera('person');
    scrollTo(stepTwoRef);
  };

  // Press-and-hold (mouse, touch or Space/Enter) shows the original photo.
  const holdHandlers = {
    onPointerDown: (e) => {
      e.preventDefault();
      setShowBefore(true);
    },
    onPointerUp: () => setShowBefore(false),
    onPointerLeave: () => setShowBefore(false),
    onPointerCancel: () => setShowBefore(false),
    onContextMenu: (e) => e.preventDefault(),
    onBlur: () => setShowBefore(false),
    onKeyDown: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setShowBefore(true);
      }
    },
    onKeyUp: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setShowBefore(false);
      }
    },
  };

  const slotLabel = SLOTS.find((s) => s.value === slot)?.label || 'Top';

  // -------------------------------------------------------------- render
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <style>{css}</style>

      <PageHero
        eyebrow="SKILLKODER PRODUCT"
        title="Virtual"
        accent="Try-On"
        lead="See how a piece of clothing looks on you. Upload a photo of an outfit you like or snap the cloth, take a photo of yourself, and our AI dresses you in a little over a minute."
      />

      <div className="vtryon">
        <div className="vtryon-wrap">
          {/* Service status */}
          <div aria-live="polite">
            {offline && (
              <div className="vtryon-alert is-warn">
                <AlertCircle size={20} aria-hidden="true" />
                <span>
                  {OFFLINE_MESSAGE} You can still get your photos ready.{' '}
                  <button type="button" className="vtryon-link-btn" onClick={checkHealth}>
                    Check again
                  </button>
                </span>
              </div>
            )}
            {health === 'busy' && (
              <div className="vtryon-alert is-warn">
                <AlertCircle size={20} aria-hidden="true" />
                <span>Someone else is trying something on right now, so yours may take a little longer.</span>
              </div>
            )}
          </div>

          {/* STEP 1 — the outfit to copy */}
          <section ref={stepOneRef} className="vtryon-card" aria-labelledby="vtryon-step1">
            <div id="vtryon-step1">
              <StepHead
                n={1}
                done={Boolean(garment) && !itemNotFound}
                title="The outfit to copy"
                sub="Any photo of the clothes: someone wearing them, a store photo, or the cloth laid flat."
              />
            </div>

            {garmentLoading && <p className="vtryon-hint" aria-live="polite">Loading the garment…</p>}

            {!garmentLoading && garment && garmentUrl && (
              <div className="vtryon-preview">
                <img src={garmentUrl} alt="The outfit you chose to copy" />
                <div className="vtryon-preview-side">
                  {itemNotFound && garmentError ? <ErrorAlert>{garmentError}</ErrorAlert> : <b>Garment ready</b>}
                  <div className="vtryon-actions" style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      className="vtryon-btn vtryon-btn-ghost"
                      disabled={loading}
                      onClick={() => {
                        clearResult();
                        setGarment(null);
                        setGarmentError('');
                        setItemNotFound(false);
                      }}
                    >
                      <RefreshCw size={18} aria-hidden="true" /> Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showGarmentPicker && camera === 'garment' && (
              <CameraCapture
                facingMode="environment"
                hint="Lay the cloth flat or hold it up on a hanger, front side facing the camera, with the whole garment in frame."
                captureLabel="Capture cloth"
                onCapture={onGarmentCaptured}
                onClose={() => setCamera(null)}
              />
            )}

            {showGarmentPicker && camera !== 'garment' && (
              <>
                <p className="vtryon-hint">
                  A photo of someone wearing it, a store photo, or the cloth laid flat. Front-facing, with the whole
                  garment in view.
                </p>
                <div className="vtryon-actions" style={{ marginTop: 0 }}>
                  <UploadButton
                    id="vtryon-garment-file"
                    label="Upload a photo"
                    ghost={false}
                    onFile={(file) => acceptFile(file, chooseGarment, setGarmentError)}
                  />
                  <button type="button" className="vtryon-btn vtryon-btn-ghost" onClick={() => setCamera('garment')}>
                    <Camera size={18} aria-hidden="true" /> Take a photo of the cloth
                  </button>
                </div>
              </>
            )}
            {garmentError && !itemNotFound && <ErrorAlert>{garmentError}</ErrorAlert>}

            <fieldset
              ref={slotsRef}
              className="vtryon-slots"
              disabled={loading}
              aria-describedby="vtryon-slot-help"
            >
              <legend>Which item?</legend>
              <div className="vtryon-slot-row">
                {SLOTS.map((s) => (
                  <label key={s.value} className="vtryon-slot">
                    <input
                      type="radio"
                      name="vtryon-slot"
                      value={s.value}
                      checked={slot === s.value}
                      onChange={() => {
                        clearResult();
                        setSlot(s.value);
                        if (itemNotFound) {
                          setItemNotFound(false);
                          setGarmentError('');
                        }
                      }}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
              <p id="vtryon-slot-help" className="vtryon-privacy">
                If the photo shows a whole outfit, pick the piece you want to try on.
              </p>
            </fieldset>
          </section>

          {/* STEP 2 — the person */}
          <section ref={stepTwoRef} className="vtryon-card" aria-labelledby="vtryon-step2">
            <div id="vtryon-step2">
              <StepHead n={2} done={Boolean(person)} title="You" sub="A front-facing photo works best." />
            </div>

            {person && personUrl && (
              <div className="vtryon-preview">
                <img src={personUrl} alt="You, as captured for the try-on" />
                <div className="vtryon-preview-side">
                  <b>Photo ready</b>
                  <div className="vtryon-actions" style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      className="vtryon-btn vtryon-btn-ghost"
                      disabled={loading}
                      onClick={() => {
                        clearResult();
                        setPerson(null);
                        setCamera('person');
                      }}
                    >
                      <RefreshCw size={18} aria-hidden="true" /> Retake
                    </button>
                    <UploadButton
                      id="vtryon-person-file-replace"
                      label="Upload instead"
                      onFile={(file) => {
                        clearResult();
                        acceptFile(file, setPerson, setPersonError);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!person && camera === 'person' && (
              <CameraCapture
                facingMode="user"
                mirrored
                countdown={3}
                hint="Stand facing the camera, upper body or full body in frame, good light, plain background."
                captureLabel="Take photo"
                onCapture={onPersonCaptured}
                onClose={() => setCamera(null)}
              />
            )}

            {!person && camera !== 'person' && (
              <div className="vtryon-actions" style={{ marginTop: 0 }}>
                <button type="button" className="vtryon-btn vtryon-btn-primary" onClick={() => setCamera('person')}>
                  <Camera size={18} aria-hidden="true" /> Open camera
                </button>
                <UploadButton
                  id="vtryon-person-file"
                  label="Upload a photo instead"
                  onFile={(file) => acceptFile(file, setPerson, setPersonError)}
                />
              </div>
            )}
            {personError && <ErrorAlert>{personError}</ErrorAlert>}
            <p className="vtryon-privacy">{PRIVACY_LINE}</p>
          </section>

          {/* STEP 3 — try it on */}
          <section className="vtryon-card" aria-labelledby="vtryon-step3">
            <div id="vtryon-step3">
              <StepHead n={3} done={phase === 'done'} title="Try it on" sub="Takes a little over a minute." />
            </div>

            <div className="vtryon-pair">
              <div className="vtryon-thumb">
                <span className="vtryon-thumb-label">You</span>
                {personUrl ? (
                  <img src={personUrl} alt="" />
                ) : (
                  <span>
                    <UserRound size={28} aria-hidden="true" />
                    <br />
                    Add your photo in step 2
                  </span>
                )}
                {loading && (
                  <div className="vtryon-loading">
                    <div className="vtryon-spinner" aria-hidden="true" />
                    <span>Dressing you… this takes a little over a minute.</span>
                    <small>{elapsed}s</small>
                  </div>
                )}
              </div>
              <div className="vtryon-thumb">
                <span className="vtryon-thumb-label">{slotLabel}</span>
                {garmentUrl ? (
                  <img src={garmentUrl} alt="" />
                ) : (
                  <span>
                    <Shirt size={28} aria-hidden="true" />
                    <br />
                    Add the cloth in step 1
                  </span>
                )}
              </div>
            </div>

            <p className="vtryon-sr" aria-live="polite">
              {loading ? 'Dressing you… this takes a little over a minute.' : ''}
            </p>

            <div className="vtryon-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="vtryon-btn vtryon-btn-primary vtryon-btn-lg"
                onClick={tryOn}
                disabled={!canTry}
              >
                <Sparkles size={20} aria-hidden="true" /> {loading ? 'Dressing you…' : 'Try it on'}
              </button>
              {loading && (
                <button type="button" className="vtryon-btn vtryon-btn-ghost" onClick={cancelTryOn}>
                  <X size={18} aria-hidden="true" /> Cancel
                </button>
              )}
            </div>
            {!loading && !canTry && !offline && (
              <p className="vtryon-note" style={{ marginTop: '0.75rem' }}>
                {itemNotFound
                  ? 'Pick a different item under "Which item?" or another photo in step 1 to continue.'
                  : !garment && !person
                  ? 'Add the cloth and your photo to continue.'
                  : !garment
                    ? 'Add the cloth in step 1 to continue.'
                    : !person
                      ? 'Add your photo in step 2 to continue.'
                      : ''}
              </p>
            )}
            {tryError && <ErrorAlert>{tryError}</ErrorAlert>}
          </section>

          {/* STEP 4 — result (shown below "Try it on", where the visitor is looking) */}
          {phase === 'done' && resultUrl && (
            <section ref={resultRef} className="vtryon-card vtryon-result" aria-labelledby="vtryon-result-title">
              <StepHead n={4} done title="Your try-on" sub={`${slotLabel} · hold the button to compare with your photo`} />
              <span id="vtryon-result-title" className="vtryon-sr">
                Your try-on result
              </span>
              <div className="vtryon-result-img">
                <img
                  src={showBefore && personUrl ? personUrl : resultUrl}
                  alt={showBefore ? 'You, before the try-on' : `You wearing the selected ${slotLabel.toLowerCase()}`}
                />
              </div>
              <p className="vtryon-sr" aria-live="polite">
                {showBefore ? 'Showing your original photo' : 'Showing the try-on result'}
              </p>
              <div className="vtryon-actions">
                <button
                  type="button"
                  className="vtryon-btn vtryon-btn-ghost vtryon-hold"
                  aria-pressed={showBefore}
                  {...holdHandlers}
                >
                  <Eye size={18} aria-hidden="true" /> Hold to see before
                </button>
                <a className="vtryon-btn vtryon-btn-primary" href={resultUrl} download="skillkoder-virtual-tryon.png">
                  <Download size={18} aria-hidden="true" /> Download
                </a>
                <button type="button" className="vtryon-btn vtryon-btn-ghost" onClick={tryAnotherCloth}>
                  <Shirt size={18} aria-hidden="true" /> Try another cloth
                </button>
                <button type="button" className="vtryon-btn vtryon-btn-ghost" onClick={retakePerson}>
                  <RefreshCw size={18} aria-hidden="true" /> Retake my photo
                </button>
              </div>
            </section>
          )}

          <p className="vtryon-note">
            Photos are sent securely to our try-on service, used once to create your preview, and then discarded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnPage;
