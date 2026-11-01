import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  Workflow,
} from 'lucide-react';
import {
  PEACH,
  PEACH_CANVAS,
  PEACH_TINT,
  PEACH_WASH,
  PEACH_BORDER,
  INK,
  INK_BODY,
  INK_MUTED,
} from '../theme/colors';
import {
  INTRO,
  SERVICES,
  PRODUCTS,
  CLIENTS,
  PROJECTS,
  ABOUT_POINTS,
} from '../data/company';
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL,
  EMAIL_HREF,
  LOCATION,
  PHONE_E164,
} from '../data/site';
import { applySEO } from '../utils/seo';

/**
 * Company homepage — SkillKoder the technology business.
 *
 * The training site that used to live at "/" is now SkillKoder Academy at
 * /academy; every other academy URL is unchanged. This page links into it from
 * the "Courses" tab.
 *
 * Uses the same palette (theme/colors) and font stack as the academy Hero so
 * both halves of the site read as one brand. Copy lives in data/company.js.
 */

/** Company brand colour — buttons, accents and highlighted text. */
const BRAND = '#e86a5d';

const ICONS ={ Brain, Workflow, Briefcase, GraduationCap, Bot, LayoutDashboard, Shirt };

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About Us' },
  { id: 'clients', label: 'Clients' },
  { id: 'projects', label: 'New Projects' },
  { id: 'courses', label: 'Courses', to: '/academy' },
  { id: 'contact', label: 'Contact Us' },
];

const WHATSAPP_BUSINESS =
  `https://wa.me/${PHONE_E164.replace('+', '')}?text=` +
  encodeURIComponent("Hi SkillKoder, I'd like to discuss a project with your team.");

const css = `
  .ck { font-family: ${FONT}; color: ${INK}; background: #fff; }
  .ck *, .ck *::before, .ck *::after { box-sizing: border-box; }
  .ck-wrap { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }

  /* ---- nav ---- */
  .ck-nav { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,0.86);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,183,132,0.2); box-shadow: 0 18px 45px rgba(0,0,0,0.06); }
  .ck-nav-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding-block: 0.85rem; }
  .ck-logo { height: 48px; width: auto; display: block; cursor: pointer; }
  .ck-tabs { display: flex; gap: 0.35rem; list-style: none; margin: 0; padding: 0; align-items: center; }
  .ck-tab { background: none; border: none; font: inherit; font-size: 0.95rem; font-weight: 600; color: #2d3748;
    padding: 0.55rem 1rem; border-radius: 999px; cursor: pointer; transition: all 0.25s ease; letter-spacing: 0.01em; }
  .ck-tab:hover { color: ${BRAND}; background: ${PEACH_WASH}; }
  .ck-tab.is-active { color: ${BRAND}; background: ${PEACH_TINT}; }
  .ck-tab.is-courses { color: #fff; background: ${BRAND}; box-shadow: 0 10px 24px rgba(232,106,93,0.25); }
  .ck-tab.is-courses:hover { transform: translateY(-1px); }
  .ck-burger { display: none; background: none; border: none; font-size: 1.75rem; cursor: pointer; color: ${INK}; line-height: 1; }

  /* ---- sections ---- */
  .ck-section { padding: 5rem 0; scroll-margin-top: 80px; }
  .ck-canvas { background: ${PEACH_CANVAS}; }
  .ck-eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.45rem 1rem; border-radius: 999px;
    background: #fff; border: 2px solid ${PEACH}30; box-shadow: 0 8px 20px rgba(255,176,136,0.25);
    color: ${BRAND}; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .ck-eyebrow::before { content: ''; width: 0.5rem; height: 0.5rem; border-radius: 999px; background: ${BRAND}; }
  .ck-h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; margin: 1rem 0 0.75rem; line-height: 1.15; }
  .ck-h2 em { font-style: normal; color: ${BRAND}; }
  .ck-lead { color: ${INK_MUTED}; font-size: 1.08rem; line-height: 1.7; max-width: 720px; margin: 0; }
  .ck-head { text-align: center; margin-bottom: 3rem; }
  .ck-head .ck-lead { margin: 0 auto; }
  .ck-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .ck-card { background: #fff; border: 1px solid ${PEACH_BORDER}; border-radius: 20px; padding: 1.75rem;
    box-shadow: 0 12px 30px rgba(255,176,136,0.12); transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .ck-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(255,176,136,0.25); }
  .ck-card h3 { margin: 1rem 0 0.5rem; font-size: 1.25rem; font-weight: 800; }
  .ck-card p { margin: 0; color: ${INK_BODY}; line-height: 1.65; }
  .ck-icon { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center;
    background: linear-gradient(135deg, ${PEACH_TINT}, ${PEACH_WASH}); color: ${BRAND}; border: 1px solid ${PEACH_BORDER}; }
  .ck-points { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; gap: 0.4rem; }
  .ck-points li { color: ${INK_BODY}; font-size: 0.93rem; padding-left: 1.2rem; position: relative; }
  .ck-points li::before { content: ''; position: absolute; left: 0; top: 0.5em; width: 7px; height: 7px; border-radius: 999px; background: ${PEACH}; }
  .ck-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.6rem; border-radius: 999px;
    font-weight: 700; text-decoration: none; border: none; cursor: pointer; font: inherit; font-weight: 700; transition: all 0.25s ease; }
  .ck-btn-primary { background: ${BRAND}; color: #fff; box-shadow: 0 18px 40px rgba(232,106,93,0.25); }
  .ck-btn-primary:hover { transform: translateY(-2px); }
  .ck-btn-ghost { background: #fff; color: ${BRAND}; border: 2px solid ${BRAND}; }
  .ck-btn-ghost:hover { background: ${PEACH_WASH}; }
  .ck-link { display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 1rem; color: ${BRAND}; font-weight: 700; text-decoration: none; }
  .ck-link:hover { text-decoration: underline; }

  /* ---- hero ---- */
  .ck-hero { position: relative; overflow: hidden; background: ${PEACH_CANVAS}; padding: 5.5rem 0 5rem; }
  .ck-hero::before, .ck-hero::after { content: ''; position: absolute; width: 22rem; height: 22rem; border-radius: 999px;
    background: ${PEACH}; filter: blur(70px); opacity: 0.35; }
  .ck-hero::before { top: -4rem; left: -4rem; }
  .ck-hero::after { bottom: -6rem; right: 10%; }
  .ck-hero-inner { position: relative; text-align: center; max-width: 900px; margin: 0 auto; }
  .ck-h1 { font-size: clamp(2.2rem, 5.2vw, 3.8rem); font-weight: 900; line-height: 1.08; margin: 1.25rem 0 1.25rem; letter-spacing: -0.02em; }
  .ck-h1 span { background: linear-gradient(135deg, ${BRAND}, ${BRAND}); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .ck-hero .ck-lead { margin: 0 auto 2rem; }
  .ck-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; }
  .ck-chips { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; margin-top: 2.5rem; }
  .ck-chip { background: #fff; border: 1px solid ${PEACH_BORDER}; border-radius: 999px; padding: 0.45rem 1rem; font-size: 0.88rem; font-weight: 600; color: ${INK_BODY}; }

  /* ---- about ---- */
  .ck-about { display: grid; gap: 3rem; grid-template-columns: 1.1fr 1fr; align-items: center; }
  .ck-stats { display: grid; gap: 1rem; }
  .ck-stat { display: flex; gap: 1rem; align-items: center; background: #fff; border: 1px solid ${PEACH_BORDER}; border-radius: 16px; padding: 1.1rem 1.25rem; }
  .ck-stat b { font-size: 1.15rem; color: ${BRAND}; min-width: 110px; }
  .ck-stat span { color: ${INK_BODY}; line-height: 1.5; }

  /* ---- clients ---- */
  .ck-clients { display: grid; gap: 1.25rem; grid-template-columns: repeat(2, 1fr); }
  .ck-client { background: #fff; border: 1px solid ${PEACH_BORDER}; border-radius: 20px; padding: 1.75rem 1.25rem; text-align: center;
    box-shadow: 0 12px 30px rgba(255,176,136,0.12); }
  .ck-client-logo { height: 88px; display: grid; place-items: center; margin-bottom: 0.9rem; }
  .ck-client-logo img { max-height: 80px; max-width: 220px; width: auto; height: auto; object-fit: contain; }
  .ck-client small { display: block; margin-top: 0.25rem; }
  .ck-client .ck-tags { justify-content: center; }
  .ck-client.is-featured { grid-column: 1 / -1; display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: center;
    text-align: left; padding: 2rem 2.25rem; border: 2px solid ${BRAND}; }
  .ck-client.is-featured .ck-client-logo { margin: 0; padding-right: 2rem; border-right: 1px solid ${PEACH_BORDER}; }
  .ck-client.is-featured .ck-client-logo img { max-width: 260px; }
  .ck-client.is-featured b { display: block; font-size: 1.5rem; margin-top: 0.6rem; }
  .ck-client.is-featured small { font-size: 1rem; }
  .ck-client.is-featured .ck-tags { justify-content: flex-start; }
  @media (max-width: 700px) {
    .ck-clients { grid-template-columns: 1fr; }
    .ck-client.is-featured { grid-template-columns: 1fr; text-align: center; gap: 1rem; padding: 1.75rem 1.25rem; }
    .ck-client.is-featured .ck-client-logo { padding: 0; border: none; }
    .ck-client.is-featured .ck-tags { justify-content: center; }
  }
  .ck-client-mark { width: 56px; height: 56px; margin: 0 auto 0.75rem; border-radius: 999px; display: grid; place-items: center;
    background: ${BRAND}; color: #fff; font-weight: 800; font-size: 1.1rem; }
  .ck-client b { display: block; }
  .ck-client small { color: ${INK_MUTED}; }

  /* ---- projects ---- */
  .ck-status { display: inline-block; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700;
    background: ${PEACH_TINT}; color: ${BRAND}; }
  .ck-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
  .ck-tags span { font-size: 0.78rem; font-weight: 600; color: ${INK_MUTED}; border: 1px solid ${PEACH_BORDER}; border-radius: 999px; padding: 0.2rem 0.65rem; }

  /* ---- courses band ---- */
  .ck-band { background: ${BRAND}; color: #fff; border-radius: 28px; padding: 3rem; display: flex; gap: 2rem;
    align-items: center; justify-content: space-between; flex-wrap: wrap; box-shadow: 0 30px 60px rgba(232,106,93,0.25); }
  .ck-band h2 { margin: 0 0 0.5rem; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; }
  .ck-band p { margin: 0; opacity: 0.95; max-width: 620px; line-height: 1.6; }
  .ck-band .ck-btn { background: #fff; color: ${BRAND}; }

  /* ---- contact ---- */
  .ck-contact a { color: inherit; text-decoration: none; }
  .ck-contact .ck-card { display: flex; gap: 1rem; align-items: center; }
  .ck-contact .ck-card h3 { margin: 0 0 0.2rem; font-size: 1rem; }

  /* ---- footer ---- */
  .ck-footer { background: ${INK}; color: #e5e7eb; padding: 2.5rem 0; }
  .ck-footer-row { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: center; }
  .ck-footer a { color: ${PEACH}; text-decoration: none; font-weight: 600; }

  @media (max-width: 960px) {
    .ck-tabs { display: none; }
    .ck-tabs.is-open { display: flex; flex-direction: column; align-items: stretch; position: absolute; top: 100%; left: 0; right: 0;
      background: #fff; padding: 1rem 1.5rem 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .ck-burger { display: block; }
    .ck-about { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .ck-wrap { padding: 0 1rem; }
    .ck-section { padding: 3.5rem 0; }
    .ck-hero { padding: 4rem 0 3.5rem; }
    .ck-logo { height: 42px; }
    .ck-band { padding: 2rem 1.5rem; }
  }
`;

const Icon = ({ name, size = 26 }) => {
  const Cmp = ICONS[name] || Brain;
  return <Cmp size={size} strokeWidth={2} aria-hidden="true" />;
};

const initials = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const CompanyHomePage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/');
  }, []);

  // Highlight the tab for whichever section is in view.
  useEffect(() => {
    const ids = TABS.filter((t) => !t.to).map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (tab) => {
    setMenuOpen(false);
    if (tab.to) {
      navigate(tab.to);
      return;
    }
    document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="ck">
      <style>{css}</style>

      <nav className="ck-nav">
        <div className="ck-wrap ck-nav-row" style={{ position: 'relative' }}>
          <img
            src="/sk_logo.webp"
            alt="SkillKoder"
            className="ck-logo"
            loading="eager"
            onClick={() => goTo(TABS[0])}
          />
          <ul className={`ck-tabs${menuOpen ? ' is-open' : ''}`}>
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  className={
                    'ck-tab' +
                    (tab.to ? ' is-courses' : '') +
                    (!tab.to && active === tab.id ? ' is-active' : '')
                  }
                  onClick={() => goTo(tab)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="ck-burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* HOME — what is SkillKoder */}
      <header id="home" className="ck-hero ck-section">
        <div className="ck-wrap ck-hero-inner">
          <span className="ck-eyebrow">What is SkillKoder</span>
          <h1 className="ck-h1">
            We build <span>AI solutions</span>, automations &amp; business software
          </h1>
          <p className="ck-lead">{INTRO}</p>
          <div className="ck-actions">
            <button type="button" className="ck-btn ck-btn-primary" onClick={() => goTo(TABS[5])}>
              Start a project <ArrowRight size={18} />
            </button>
            <Link to="/academy" className="ck-btn ck-btn-ghost">
              View courses
            </Link>
          </div>
          <div className="ck-chips">
            {SERVICES.map((s) => (
              <span key={s.title} className="ck-chip">{s.title}</span>
            ))}
            <span className="ck-chip">SkillKoder Academy</span>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section className="ck-section" aria-labelledby="services-title">
        <div className="ck-wrap">
          <div className="ck-head">
            <span className="ck-eyebrow">What we build</span>
            <h2 id="services-title" className="ck-h2">Solutions that <em>move your business</em></h2>
            <p className="ck-lead">Three practices, one team — so your AI, automation and software work together.</p>
          </div>
          <div className="ck-grid">
            {SERVICES.map((s) => (
              <article key={s.title} className="ck-card">
                <div className="ck-icon"><Icon name={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="ck-points">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="ck-section ck-canvas" aria-labelledby="products-title">
        <div className="ck-wrap">
          <div className="ck-head">
            <span className="ck-eyebrow">Our products</span>
            <h2 id="products-title" className="ck-h2">Products by <em>SkillKoder</em></h2>
            <p className="ck-lead">Ready-made platforms we build, run and keep improving.</p>
          </div>
          <div className="ck-grid">
            {PRODUCTS.map((p) => (
              <article key={p.name} className="ck-card">
                <div className="ck-icon"><Icon name={p.icon} /></div>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                {p.link && (
                  <Link to={p.link} className="ck-link">
                    {p.cta || 'Learn more'} <ArrowRight size={16} />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="ck-section" aria-labelledby="about-title">
        <div className="ck-wrap ck-about">
          <div>
            <span className="ck-eyebrow">About us</span>
            <h2 id="about-title" className="ck-h2">Technology partner, <em>talent builder</em></h2>
            <p className="ck-lead" style={{ marginBottom: '1rem' }}>
              SkillKoder started as a training company and grew into a technology partner. The same
              engineers who teach our Data and AI courses design and deliver solutions for our clients —
              so what we teach is what we build, and what we build is what we teach.
            </p>
            <p className="ck-lead">Based in {LOCATION}, working with businesses across India and abroad.</p>
          </div>
          <div className="ck-stats">
            {ABOUT_POINTS.map((a) => (
              <div key={a.value} className="ck-stat">
                <b>{a.value}</b>
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" className="ck-section ck-canvas" aria-labelledby="clients-title">
        <div className="ck-wrap">
          <div className="ck-head">
            <span className="ck-eyebrow">Current clients</span>
            <h2 id="clients-title" className="ck-h2">Trusted by <em>growing businesses</em></h2>
            <p className="ck-lead">Organisations we are building AI, automation and business solutions for.</p>
          </div>
          <div className="ck-clients">
            {CLIENTS.map((c) => (
              <div key={c.name} className={'ck-client' + (c.featured ? ' is-featured' : '')}>
                <div className="ck-client-logo">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={`${c.name} logo`}
                      style={c.logoBg ? { background: c.logoBg, padding: '1.1rem 1.4rem', borderRadius: 14 } : undefined}
                    />
                  ) : (
                    <div className="ck-client-mark" aria-hidden="true">{initials(c.name)}</div>
                  )}
                </div>
                <div>
                  {c.featured && <span className="ck-status">Featured client</span>}
                  <b>{c.name}</b>
                  {c.note && <small>{c.note}</small>}
                  {c.locations && (
                    <div className="ck-tags">
                      {c.locations.map((l) => <span key={l}>{l}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW PROJECTS */}
      <section id="projects" className="ck-section" aria-labelledby="projects-title">
        <div className="ck-wrap">
          <div className="ck-head">
            <span className="ck-eyebrow">New projects</span>
            <h2 id="projects-title" className="ck-h2">What we are <em>building now</em></h2>
            <p className="ck-lead">A look at recent and in-progress work from the SkillKoder team.</p>
          </div>
          <div className="ck-grid">
            {PROJECTS.map((p) => (
              <article key={p.title} className="ck-card">
                <span className="ck-status">{p.status}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="ck-tags">
                  {p.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES — gateway to the academy site */}
      <section className="ck-section ck-canvas" aria-labelledby="courses-title">
        <div className="ck-wrap">
          <div className="ck-band">
            <div>
              <h2 id="courses-title">SkillKoder Academy</h2>
              <p>
                Live, project-based courses in Data Analytics, Data Science, Generative AI and Azure Data
                Engineering — with placement support.
              </p>
            </div>
            <Link to="/academy" className="ck-btn">
              Explore courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="ck-section ck-contact" aria-labelledby="contact-title">
        <div className="ck-wrap">
          <div className="ck-head">
            <span className="ck-eyebrow">Contact us</span>
            <h2 id="contact-title" className="ck-h2">Let's build <em>something together</em></h2>
            <p className="ck-lead">Tell us about your idea or problem — we usually reply within one business day.</p>
          </div>
          <div className="ck-grid">
            <a className="ck-card" href={PHONE_TEL}>
              <div className="ck-icon"><Phone size={24} /></div>
              <div><h3>Call us</h3><p>{PHONE_DISPLAY}</p></div>
            </a>
            <a className="ck-card" href={EMAIL_HREF}>
              <div className="ck-icon"><Mail size={24} /></div>
              <div><h3>Email</h3><p>{EMAIL}</p></div>
            </a>
            <a className="ck-card" href={WHATSAPP_BUSINESS} target="_blank" rel="noopener noreferrer">
              <div className="ck-icon"><MessageCircle size={24} /></div>
              <div><h3>WhatsApp</h3><p>Chat with our team</p></div>
            </a>
            <div className="ck-card">
              <div className="ck-icon"><MapPin size={24} /></div>
              <div><h3>Office</h3><p>{LOCATION}</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="ck-footer">
        <div className="ck-wrap ck-footer-row">
          <span>© {new Date().getFullYear()} SkillKoder. All rights reserved.</span>
          <Link to="/academy">SkillKoder Academy — Courses →</Link>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHomePage;
