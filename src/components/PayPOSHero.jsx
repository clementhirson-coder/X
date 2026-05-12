import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
   TERMINAL POSITIONING + IMAGE CROP
   devices6.png contains a smartphone (left) + Verifone terminal (right).
   We render the image at IMG_DISPLAY_WIDTH and shift it by IMG_OFFSET_X
   inside an overflow:hidden mask so only the right device is visible.
   Tune these two values if the proportions of the image change.
   ───────────────────────────────────────────────────────────── */
const TERMINAL_WIDTH    = 420;   // final visible width of the terminal device
const IMG_DISPLAY_WIDTH = 840;   // image rendered at 2× — adjust if image proportions differ
const IMG_OFFSET_X      = -420;  // shift left to hide the smartphone

/* ──────────────────────────────────────────────────────────────
   FAKE SCREEN OVERLAY — adjust pixel-by-pixel to align with terminal
   These four values position a div exactly over the terminal screen.
   ───────────────────────────────────────────────────────────── */
const SCREEN_TOP    = 82;
const SCREEN_LEFT   = 50;
const SCREEN_WIDTH  = 224;
const SCREEN_HEIGHT = 385;
const SCREEN_RADIUS = 24;

/* ── Scroll mechanics ── */
const SCROLL_PX = 600;     // total pinned scroll distance
const TOTAL_STATES = 7;    // states 0..6

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',     short: 'PAY-BY-LINK', color: '#00d4ff' },
  { id: 'bnpl',      label: 'BNPL & Credit', short: 'BNPL',        color: '#a855f7' },
  { id: 'wero',      label: 'Wero',          short: 'WERO',        color: '#6366f1' },
  { id: 'noshow',    label: 'NoShow',        short: 'NOSHOW',      color: '#10b981' },
  { id: 'crypto',    label: 'Crypto',        short: 'CRYPTO',      color: '#f7931a' },
  { id: 'a2a',       label: 'A2A & Wallets', short: 'A2A',         color: '#3b82f6' },
];

const PARTICLES = [
  { id: 0, size: 2, l: '55%', t: '18%', op: 0.20, dur: 4.2, del: 0    },
  { id: 1, size: 3, l: '72%', t: '12%', op: 0.18, dur: 6.0, del: -1.5 },
  { id: 2, size: 2, l: '86%', t: '30%', op: 0.22, dur: 5.4, del: -3.0 },
  { id: 3, size: 3, l: '88%', t: '54%', op: 0.15, dur: 7.0, del: -2.0 },
  { id: 4, size: 2, l: '78%', t: '74%', op: 0.20, dur: 5.8, del: -4.0 },
  { id: 5, size: 2, l: '60%', t: '82%', op: 0.18, dur: 6.4, del: -1.0 },
  { id: 6, size: 3, l: '50%', t: '40%', op: 0.15, dur: 4.8, del: -2.7 },
  { id: 7, size: 2, l: '92%', t: '46%', op: 0.25, dur: 3.6, del: -0.6 },
];

/* ── Inline SVG icons, 32×32 viewBox ── */
function ProductIcon({ id, size = 32 }) {
  const common = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none' };
  switch (id) {
    case 'paybylink':
      return (
        <svg {...common}>
          <path d="M13 17a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
            stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M19 15a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
            stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'bnpl':
      return (
        <svg {...common}>
          <rect x="3" y="8" width="26" height="18" rx="3" stroke="#a855f7" strokeWidth="2" />
          <path d="M3 13h26" stroke="#a855f7" strokeWidth="2" />
          <path d="M8 19h4M8 22h6" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 19l-3 3M25 19l-3 3" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'wero':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" stroke="#6366f1" strokeWidth="2" />
          <path d="M9 11l3 10 4-7 4 7 3-10"
            stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'noshow':
      return (
        <svg {...common}>
          <path d="M16 3L4 8v8c0 7 5.4 11.9 12 14 6.6-2.1 12-7 12-14V8L16 3z"
            stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
          <path d="M11 16l3 3 7-7"
            stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'crypto':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" stroke="#f7931a" strokeWidth="2" />
          <path d="M13 10h6a3 3 0 010 6h-6m0 0h7a3 3 0 010 6h-7m0-12v12m2-14v2m3-2v2m-3 12v2m3-2v2"
            stroke="#f7931a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'a2a':
      return (
        <svg {...common}>
          <circle cx="8"  cy="16" r="5" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="24" cy="16" r="5" stroke="#3b82f6" strokeWidth="2" />
          <path d="M13 13l6-3M13 19l6 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default: return null;
  }
}

/* ── Helpers ── */
function useTime() {
  const fmt = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function ScreenStatusBar({ time, dim = false }) {
  const color = dim ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.7)';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px', color, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
    }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M1 4.2a8 8 0 0110 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M2.7 6.6a5 5 0 016.6 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M4.2 9a2 2 0 013.6 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="6" cy="10.5" r="0.6" fill="currentColor" />
      </svg>
      <span>{time}</span>
      <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
        <rect x="0.5" y="0.5" width="12" height="8" rx="1.5" stroke="currentColor" />
        <rect x="2" y="2" width="8" height="5" fill="currentColor" />
        <rect x="13" y="3" width="1.6" height="3" fill="currentColor" />
      </svg>
    </div>
  );
}

function ScreenHeader({ time }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.6)',
      fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
    }}>
      <span>PAYPOS</span>
      <span style={{ letterSpacing: '0.08em' }}>{time}</span>
    </div>
  );
}

function ScreenCell({ id, featured = false }) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;
  const iconSize  = featured ? 48 : 32;
  const labelSize = featured ? 10 : 8;
  return (
    <div className="pp-cell" style={{
      background: `${p.color}1A`,
      borderRadius: 14,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: featured ? 8 : 4,
      padding: featured ? '14px 8px' : '6px',
      flex: 1, minHeight: 0,
      willChange: 'transform',
    }}>
      <ProductIcon id={id} size={iconSize} />
      <span style={{
        color: p.color, fontSize: labelSize, fontWeight: 700,
        letterSpacing: '0.18em',
      }}>{p.short}</span>
    </div>
  );
}

function Placeholder() {
  return <div style={{ height: 42, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />;
}

/* ── Screen content per state ───────────────────────────── */
function ScreenContent({ state, time }) {
  const inner = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    background: state === 0
      ? 'linear-gradient(180deg, #0d1b3e 0%, #0a1628 100%)'
      : '#0d1b3e',
  };

  if (state === 0) {
    return (
      <div style={inner}>
        <ScreenStatusBar time={time} dim />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '0.12em' }}>PAYPOS</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.06em' }}>{time}</div>
        </div>
        <div style={{ position: 'relative', height: 2, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%', width: '60%',
            background: 'linear-gradient(90deg, transparent, #00d4ff 50%, transparent)',
            animation: 'pp-scanline 2s linear infinite',
          }} />
        </div>
      </div>
    );
  }

  if (state === 1) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '10px 10px 6px', flex: '0 0 42%', display: 'flex' }}>
          <ScreenCell id="paybylink" featured />
        </div>
        <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Placeholder /><Placeholder /><Placeholder />
        </div>
      </div>
    );
  }

  if (state === 2) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '10px 10px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: '0 0 30%' }}>
          <ScreenCell id="paybylink" />
          <ScreenCell id="bnpl" />
        </div>
        <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Placeholder /><Placeholder />
        </div>
      </div>
    );
  }

  if (state === 3) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 6, flex: 1 }}>
          <ScreenCell id="paybylink" />
          <ScreenCell id="bnpl" />
          <ScreenCell id="wero" />
          <div /> {/* middle-right empty */}
          <Placeholder /><Placeholder />
        </div>
      </div>
    );
  }

  if (state === 4) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 6, flex: 1 }}>
          <ScreenCell id="paybylink" />
          <ScreenCell id="bnpl" />
          <ScreenCell id="wero" />
          <ScreenCell id="noshow" />
        </div>
      </div>
    );
  }

  if (state === 5) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 6, flex: 1 }}>
          <ScreenCell id="paybylink" />
          <ScreenCell id="bnpl" />
          <ScreenCell id="wero" />
          <ScreenCell id="noshow" />
          <ScreenCell id="crypto" />
          <div />
        </div>
      </div>
    );
  }

  /* state === 6 — final */
  return (
    <div style={inner} className="pp-state6">
      <ScreenHeader time={time} />
      <div style={{
        textAlign: 'center', color: '#00d4ff',
        fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
        padding: '4px 0 0',
      }}>
        6 MODULES ACTIFS
      </div>
      <div style={{ padding: '8px 10px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 6, flex: 1 }}>
        {PRODUCTS.map(p => <ScreenCell key={p.id} id={p.id} />)}
      </div>
    </div>
  );
}

/* ── Progress dots (left panel) ── */
function ProgressDots({ activeState }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {PRODUCTS.map((p, i) => {
        const lit = activeState >= i + 1;
        return (
          <span key={p.id} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: lit ? '#00d4ff' : 'rgba(255,255,255,0.2)',
            boxShadow: lit ? `0 0 8px ${p.color}` : 'none',
            transition: 'background 0.3s, box-shadow 0.3s',
          }} />
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */

export default function PayPOSHero() {
  const sectionRef       = useRef(null);
  const subtitleRef      = useRef(null);
  const activeStateRef   = useRef(0);
  const time             = useTime();

  const [isMobile, setIsMobile]       = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [activeState, setActiveState] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const h  = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let st;
    const timer = setTimeout(() => {
      const section = sectionRef.current;
      if (!section) return;

      st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        start: 'top top',
        end: `+=${SCROLL_PX}`,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const raw = self.progress * (TOTAL_STATES - 1);
          const next = Math.max(0, Math.min(TOTAL_STATES - 1, Math.round(raw)));
          if (next !== activeStateRef.current) {
            activeStateRef.current = next;
            setActiveState(next);
          }
        },
      });
    }, 120);

    return () => { clearTimeout(timer); st?.kill(); };
  }, [isMobile]);

  /* ─────────────────── Mobile layout (static, final state) ─────────────────── */
  if (isMobile) {
    return (
      <section style={{ ...S.root, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '64px 20px', overflow: 'visible' }}>
        <GlobalStyles />
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={S.eyebrow} className="pp-eyebrow">Next-Gen Payment Terminal</span>
          <div style={S.eyebrowLine} />
          <h1 style={{ ...S.h1, fontSize: 'clamp(36px,10vw,56px)' }}>
            <span style={S.gradientH1}>One Terminal.</span><br />Every Payment.
          </h1>
          <p style={S.subtitle}>
            PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
          </p>
        </div>
        <TerminalWithScreen activeState={6} time={time} scale={0.78} />
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={S.root}>
      <GlobalStyles />

      {/* Ambient: pulsing radial */}
      <div style={S.atmoPulse} />

      {/* Connecting lines (left → terminal) */}
      <svg style={S.connectSvg} width="100%" height="100%" preserveAspectRatio="none">
        <line x1="30%" y1="50%" x2="70%" y2="50%"
          stroke="rgba(0,212,255,0.08)" strokeWidth="1" strokeDasharray="3 6" className="pp-dash" />
      </svg>

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.l, top: p.t,
          width: p.size, height: p.size, borderRadius: '50%',
          background: '#fff', opacity: p.op,
          animation: `pp-float ${p.dur}s ease-in-out ${p.del}s infinite`,
          pointerEvents: 'none', zIndex: 2,
        }} />
      ))}

      {/* ── Left content ── */}
      <div style={S.textBlock}>
        <span style={S.eyebrow} className="pp-eyebrow">Next-Gen Payment Terminal</span>
        <div style={S.eyebrowLine} />
        <h1 style={S.h1}>
          <span style={S.gradientH1}>One Terminal.</span>
          <br />Every Payment.
        </h1>
        <ProgressDots activeState={activeState} />
        <p ref={subtitleRef} style={{
          ...S.subtitle,
          opacity: activeState >= 6 ? 1 : 0,
          transform: activeState >= 6 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
        }}>
          PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
        </p>
        <button style={{
          ...S.cta,
          opacity: activeState >= 6 ? 1 : 0,
          transform: activeState >= 6 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s, scale 0.2s ease, box-shadow 0.2s ease',
          pointerEvents: activeState >= 6 ? 'auto' : 'none',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.scale = '1.03'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.scale = '1'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Découvrir PayPOS →
        </button>
      </div>

      {/* ── Terminal (right side) ── */}
      <TerminalWithScreen activeState={activeState} time={time} />
    </section>
  );
}

/* ── Terminal + cropped image + screen overlay ── */
function TerminalWithScreen({ activeState, time, scale = 1 }) {
  const intense = activeState === 6;
  return (
    <div style={{
      position: 'absolute',
      right: '8%', top: '50%',
      transform: `translateY(-50%) scale(${scale})`,
      transformOrigin: 'center',
      width: TERMINAL_WIDTH,
      filter: 'drop-shadow(0 0 80px rgba(0,100,255,0.18))',
      zIndex: 5,
    }}>
      {/* Glow ring behind terminal */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: TERMINAL_WIDTH * 1.4, height: TERMINAL_WIDTH * 1.4,
        borderRadius: '50%',
        boxShadow: intense
          ? '0 0 160px 50px rgba(0,150,255,0.35)'
          : '0 0 120px 40px rgba(0,100,255,0.15)',
        transition: 'box-shadow 1s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Cropped image mask — mix-blend-mode on the outer div so the
          terminal shape composites against the page background correctly */}
      <div style={{
        position: 'relative',
        width: TERMINAL_WIDTH,
        overflow: 'hidden',
        zIndex: 1,
        mixBlendMode: 'screen',
      }}>
        <img
          src={`${import.meta.env.BASE_URL}devices6.png`}
          alt="PayPOS Terminal"
          style={{
            width: IMG_DISPLAY_WIDTH,
            marginLeft: IMG_OFFSET_X,
            display: 'block',
          }}
        />
      </div>

      {/* Fake screen overlay — adjust SCREEN_TOP/LEFT/WIDTH/HEIGHT/RADIUS at top of file */}
      <div style={{
        position: 'absolute',
        top:    SCREEN_TOP,
        left:   SCREEN_LEFT,
        width:  SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        borderRadius: SCREEN_RADIUS,
        overflow: 'hidden',
        background: '#0d1b3e',
        zIndex: 10,
        boxShadow: intense
          ? '0 0 0 1px rgba(0,212,255,0.5), 0 0 40px 6px rgba(0,212,255,0.35), inset 0 0 12px rgba(0,212,255,0.15)'
          : 'inset 0 0 8px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.6s ease',
        willChange: 'transform',
      }}>
        <ScreenContent state={activeState} time={time} />
        {/* Flash overlay — remounts on state change to re-trigger the CSS animation */}
        <div
          key={activeState}
          className="pp-flash"
          style={{
            background: activeState === 0
              ? 'rgba(255,255,255,0.6)'
              : PRODUCTS[Math.min(activeState - 1, PRODUCTS.length - 1)].color,
          }}
        />
      </div>
    </div>
  );
}

/* ── Global styles + keyframes ── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');

      @keyframes pp-float {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-9px); }
      }
      @keyframes pp-eyebrow-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pp-atmo-pulse {
        0%, 100% { opacity: 0.8; }
        50%      { opacity: 1;   }
      }
      @keyframes pp-scanline {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(266%); }
      }
      @keyframes pp-dash-flow {
        to { stroke-dashoffset: -36; }
      }
      @keyframes pp-flash {
        0%   { opacity: 0; }
        25%  { opacity: 0.35; }
        100% { opacity: 0; }
      }
      @keyframes pp-finale-pulse {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.05); }
      }

      .pp-eyebrow  { animation: pp-eyebrow-in 0.6s ease both; }
      .pp-dash     { animation: pp-dash-flow 3s linear infinite; }
      .pp-flash    {
        position: absolute; inset: 0;
        pointer-events: none;
        opacity: 0;
        animation: pp-flash 0.5s ease forwards;
        mix-blend-mode: screen;
      }
      .pp-state6 .pp-cell {
        animation: pp-finale-pulse 0.5s ease 0.2s;
      }
    `}</style>
  );
}

const S = {
  root: {
    background: '#0a0a0f',
    fontFamily: 'Manrope, sans-serif',
    position: 'relative',
    minHeight: '100vh',
    overflow: 'clip',
  },
  atmoPulse: {
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 65% 50%, rgba(0,80,255,0.12) 0%, transparent 60%)',
    animation: 'pp-atmo-pulse 4s ease-in-out infinite',
  },
  connectSvg: {
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
  },
  textBlock: {
    position: 'absolute', left: '6%', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460,
  },
  eyebrow: {
    color: '#00d4ff', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.3em', textTransform: 'uppercase',
    marginBottom: 0,
  },
  eyebrowLine: {
    width: 80, height: 1,
    background: 'linear-gradient(90deg, #00d4ff, transparent)',
    opacity: 0.6,
  },
  h1: {
    fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.05, margin: 0,
  },
  gradientH1: {
    background: 'linear-gradient(135deg, #ffffff 0%, #a8d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6, maxWidth: 380,
    margin: 0,
  },
  cta: {
    alignSelf: 'flex-start',
    background: '#00d4ff', color: '#000',
    fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
    border: 'none', borderRadius: 100,
    padding: '14px 28px', cursor: 'pointer',
    willChange: 'transform',
  },
};
