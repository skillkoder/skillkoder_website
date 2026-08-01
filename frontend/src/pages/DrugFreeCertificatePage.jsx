import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

// ─── Sheet config ──────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vStuPPiTzJ-stJEJdFiMyFgXpFUi_XpiCCQUttIjzo0E8g5XpJUXt6iIf91GFOlVx1-wMZl0bSO6lkj/pub?gid=1313241976&single=true&output=csv';

// Place your cert.png inside frontend/public/
const CERT_TEMPLATE = process.env.PUBLIC_URL + '/cert.png';

// ─── Certificate field layout (mirrors the Python script) ─────────────────────
// Coordinates are in ReportLab space (origin = bottom-left, Y up).
// They are converted to canvas space (origin = top-left, Y down) at draw time.
const FIELDS = {
  name:    { x: 762, y: 672, size: 30, color: 'rgb(18,41,102)' },
  college: { x: 672, y: 588, size: 24, color: 'rgb(18,41,102)' },
  certNo:  { x: 505, y: 125, size: 13, color: 'rgb(0,0,0)'     },
  date:    { x: 683, y: 125, size: 13, color: 'rgb(0,0,0)'     },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const parseRow = (line) => {
    const result = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQ = !inQ; }
      } else if (ch === ',' && !inQ) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const vals = parseRow(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] !== undefined ? vals[i] : ''; });
    return obj;
  });
  return { headers, rows };
}

function findRowByEmail(rows, email) {
  const target = email.trim().toLowerCase();
  return (
    rows.find((row) =>
      Object.values(row).some(
        (v) => typeof v === 'string' && v.trim().toLowerCase() === target
      )
    ) || null
  );
}

function extractCertData(userData) {
  const studentName = (userData['Student Name'] || '').trim();
  const college     = (userData['College Name'] || '').trim();
  const certNo      = (userData['Certificate No'] || '').trim();
  const timestamp   = (userData['Timestamp'] || '').trim();

  let date = '';
  if (timestamp) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      date = `${dd}-${mm}-${d.getFullYear()}`;
    } else {
      date = timestamp;
    }
  }

  return { studentName, college, certNo, date };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

// Draw certificate onto a canvas context
function drawCertificate(ctx, templateImg, certData) {
  const W = templateImg.naturalWidth;
  const H = templateImg.naturalHeight;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(templateImg, 0, 0);

  // ReportLab Y → canvas Y: canvas_y = H - reportlab_y
  const drawCentered = (text, x, y, size, color) => {
    ctx.save();
    ctx.font          = `bold ${size}px "Times New Roman", Times, serif`;
    ctx.fillStyle     = color;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'alphabetic';
    ctx.fillText(text, x, H - y);
    ctx.restore();
  };

  drawCentered(certData.studentName, FIELDS.name.x,    FIELDS.name.y,    FIELDS.name.size,    FIELDS.name.color);
  drawCentered(certData.college,     FIELDS.college.x, FIELDS.college.y, FIELDS.college.size, FIELDS.college.color);
  drawCentered(certData.certNo,      FIELDS.certNo.x,  FIELDS.certNo.y,  FIELDS.certNo.size,  FIELDS.certNo.color);
  drawCentered(certData.date,        FIELDS.date.x,    FIELDS.date.y,    FIELDS.date.size,    FIELDS.date.color);
}

// ─── Certificate preview (canvas) ─────────────────────────────────────────────
const CertificatePreview = ({ userData }) => {
  const canvasRef      = useRef(null);
  const [imgErr, setImgErr] = useState('');
  const certData = extractCertData(userData);

  useEffect(() => {
    let cancelled = false;

    loadImage(CERT_TEMPLATE)
      .then((img) => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        drawCertificate(canvas.getContext('2d'), img, certData);
      })
      .catch((err) => {
        if (!cancelled) setImgErr(err.message);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <>
      {imgErr && (
        <div style={{
          padding: '1rem 1.25rem',
          background: '#FFFAF0',
          border: '1px solid #F6AD55',
          borderRadius: '10px',
          color: '#C05621',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}>
          <strong>Template not found.</strong> Please place <code>cert.png</code> inside{' '}
          <code>frontend/public/</code> and reload the page.<br />
          <span style={{ fontSize: '0.82rem', color: '#718096' }}>({imgErr})</span>
        </div>
      )}
      <div style={{ width: '100%', overflowX: 'auto', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', maxWidth: '860px', margin: '0 auto', borderRadius: '12px' }}
        />
      </div>
    </>
  );
};

// ─── PDF download ──────────────────────────────────────────────────────────────
async function downloadCertificatePDF(userData) {
  const certData = extractCertData(userData);
  const img = await loadImage(CERT_TEMPLATE);
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  // Draw onto an offscreen canvas to get a data URL
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  drawCertificate(canvas.getContext('2d'), img, certData);
  const imgData = canvas.toDataURL('image/png');

  const doc = new jsPDF({
    orientation: W > H ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [W, H],
  });

  doc.addImage(imgData, 'PNG', 0, 0, W, H);

  const safe = (str) => str.replace(/[^a-zA-Z0-9 _-]/g, '').trim();
  const filename = certData.certNo
    ? `${safe(certData.certNo)}_${safe(certData.studentName)}.pdf`
    : `${safe(certData.studentName)}_certificate.pdf`;

  doc.save(filename);
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const DrugFreeCertificatePage = () => {
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState('idle'); // idle|loading|found|not_found|error
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Drug-Free Certificate — SkillKoder';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setUserData(null);
    setErrorMsg('');

    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status} — network error`);
      const text = await res.text();
      const { rows } = parseCSV(text);
      const found = findRowByEmail(rows, email);

      if (found) { setUserData(found); setStatus('found'); }
      else        { setStatus('not_found'); }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!userData) return;
    setPdfLoading(true);
    try {
      await downloadCertificatePDF(userData);
    } catch (err) {
      alert('PDF generation failed: ' + err.message);
    } finally {
      setPdfLoading(false);
    }
  };

  const reset = () => { setEmail(''); setStatus('idle'); setUserData(null); setErrorMsg(''); };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <style>{`
        .cert-input:focus {
          outline: none;
          border-color: #FF8A54 !important;
          box-shadow: 0 0 0 3px rgba(255,138,84,0.15) !important;
        }
        .cert-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(255,138,84,0.45) !important;
        }
        .cert-btn-primary:active { transform: scale(0.98); }
        .cert-btn-outline:hover { color: #FF8A54 !important; border-color: #FF8A54 !important; }
      `}</style>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #fff6f0 0%, #fff 60%, #f0f4ff 100%)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.45rem 1.4rem',
          background: '#FFF5F0',
          borderRadius: '25px',
          marginBottom: '1rem',
          border: '1px solid #FFE8DC',
        }}>
          <span style={{ color: '#FF8A54', fontWeight: '600', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
            DRUG-FREE INITIATIVE
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: '800',
          color: '#1a202c',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          Download Your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Drug-Free Certificate
          </span>
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5568',
          maxWidth: '560px',
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Enter the email address you used during registration to retrieve and
          download your personalised certificate instantly.
        </p>
      </section>

      {/* ── Content ── */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* Email form — hidden once found */}
        {status !== 'found' && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            border: '1px solid #f0f0f0',
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.4rem' }}>
              Verify Your Email
            </h2>
            <p style={{ color: '#718096', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.65 }}>
              We'll look up your pledge record and generate your certificate instantly — no login required.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                className="cert-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  fontSize: '1rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#fafafa',
                  color: '#1a202c',
                  marginBottom: '1.25rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              <button
                className="cert-btn-primary"
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: status === 'loading' ? '#e2e8f0' : 'linear-gradient(135deg, #FF8A54, #FFB088)',
                  color: status === 'loading' ? '#a0aec0' : '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(255,138,84,0.3)',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {status === 'loading' ? 'Searching…' : 'Get My Certificate →'}
              </button>
            </form>

            {status === 'not_found' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '10px', color: '#C53030', fontSize: '0.95rem', lineHeight: 1.8 }}>
                <strong>No record found</strong> for <em>{email}</em>.<br />
                Your email is not registered in our system. Please fill out the pledge form to receive your certificate:{' '}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSedrxCf8MW53kjwezWfwS9z3eLNxK-sCG4nrWNr5N4FgILw-g/viewform?usp=send_form"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FF8A54', fontWeight: '700', textDecoration: 'underline', wordBreak: 'break-all' }}
                >
                  Click here to fill the form
                </a>
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#FFFAF0', border: '1px solid #F6AD55', borderRadius: '10px', color: '#C05621', fontSize: '0.95rem', lineHeight: 1.6 }}>
                <strong>Error:</strong> {errorMsg}<br />
                <span style={{ fontSize: '0.87rem', color: '#718096' }}>
                  This may be a CORS or network issue. Please try again or contact support.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Certificate view */}
        {status === 'found' && userData && (
          <>
            {/* Action bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ display: 'inline-block', padding: '0.35rem 1rem', background: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: '25px', color: '#276749', fontWeight: '600', fontSize: '0.85rem' }}>
                ✓ Record found
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="cert-btn-primary"
                  onClick={handleDownload}
                  disabled={pdfLoading}
                  style={{
                    padding: '0.65rem 1.4rem',
                    background: pdfLoading ? '#e2e8f0' : 'linear-gradient(135deg, #FF8A54, #FFB088)',
                    color: pdfLoading ? '#a0aec0' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: pdfLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 10px rgba(255,138,84,0.3)',
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  {pdfLoading ? 'Generating…' : 'Download PDF'}
                </button>
                <button
                  className="cert-btn-outline"
                  onClick={reset}
                  style={{
                    padding: '0.65rem 1.2rem',
                    background: '#fff',
                    color: '#718096',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  Search again
                </button>
              </div>
            </div>

            {/* Canvas preview */}
            <CertificatePreview userData={userData} />
          </>
        )}
      </section>
    </div>
  );
};

export default DrugFreeCertificatePage;
