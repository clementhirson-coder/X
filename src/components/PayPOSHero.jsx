import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const TERMINAL_WIDTH   = 570;
const TERMINAL_IMG     = 'terminal-photo.png';
const SCREEN_LEFT      = 214;
const SCREEN_TOP       = 46;
const SCREEN_WIDTH     = 183;
const SCREEN_HEIGHT    = 453;
const SCREEN_RADIUS    = 8;
const SCREEN_TRANSFORM = 'perspective(500px) rotateY(5.5deg) rotateX(-0.5deg)';
const SCREEN_PERIM     = 1254;
const THW              = TERMINAL_WIDTH / 2;
const RIGHT_OFFSET_PCT = 0.20;

const PHASE1      = 0.5;
const PHASE2      = 0.6;
const PHASE4      = 1.5;
const PRODUCT_DUR = PHASE1 + PHASE2 + PHASE4;   // 2.6
const TOTAL_DUR   = 6 * PRODUCT_DUR;             // 15.6
const END_SCROLL  = 600;
const CARD_H_EST  = 52;

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',     short: 'PAY-BY-LINK', color: '#00d4ff', ox: -1 },
  { id: 'bnpl',      label: 'BNPL & Credit', short: 'BNPL',        color: '#a855f7', ox:  1 },
  { id: 'wero',      label: 'Wero',          short: 'WERO',        color: '#6366f1', ox: -1 },
  { id: 'noshow',    label: 'NoShow',        short: 'NOSHOW',      color: '#10b981', ox:  1 },
  { id: 'crypto',    label: 'Crypto',        short: 'CRYPTO',      color: '#f7931a', ox: -1 },
  { id: 'a2a',       label: 'A2A & Wallets', short: 'A2A',         color: '#3b82f6', ox:  1 },
];

const PARTICLES = [
  { id: 0,  size: 2, l: '44%', t: '17%', op: 0.30, dur: 5.2, del: 0    },
  { id: 1,  size: 3, l: '68%', t: '11%', op: 0.20, dur: 7.1, del: -2.1 },
  { id: 2,  size: 2, l: '79%', t: '27%', op: 0.25, dur: 6.3, del: -4.0 },
  { id: 3,  size: 2, l: '83%', t: '44%', op: 0.20, dur: 8.0, del: -1.3 },
  { id: 4,  size: 3, l: '76%', t: '66%', op: 0.30, dur: 5.5, del: -3.2 },
  { id: 5,  size: 2, l: '59%', t: '79%', op: 0.20, dur: 6.1, del: -5.0 },
  { id: 6,  size: 2, l: '46%', t: '73%', op: 0.25, dur: 7.4, del: -2.0 },
  { id: 7,  size: 3, l: '37%', t: '56%', op: 0.20, dur: 4.2, del: -4.5 },
];

/* ── French time hook ── */
function formatFrenchTime() {
  return new Date().toLocaleTimeString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}
function useFrenchTime() {
  const [time, setTime] = useState(() => (typeof window !== 'undefined' ? formatFrenchTime() : '00:00'));
  useEffect(() => {
    setTime(formatFrenchTime());
    const id = setInterval(() => setTime(formatFrenchTime()), 60000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── Branded SVG icons ── */
function ProductIcon({ id, size = 24, color }) {
  const c = color || (PRODUCTS.find(p => p.id === id)?.color ?? '#00d4ff');
  const common = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none' };
  switch (id) {
    case 'paybylink':
      return (
        <svg {...common}>
          <path d="M13 17a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
            stroke={c} strokeWidth="2" strokeLinecap="round" />
          <path d="M19 15a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
            stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'bnpl':
      return (
        <svg {...common}>
          <rect x="3" y="8" width="26" height="18" rx="3" stroke={c} strokeWidth="2" />
          <path d="M3 13h26" stroke={c} strokeWidth="2" />
          <path d="M8 19h4M8 22h6" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <path d="M22 19l-3 3M25 19l-3 3" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'wero':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="2" />
          <path d="M9 11l3 10 4-7 4 7 3-10"
            stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'noshow':
      return (
        <svg {...common}>
          <path d="M16 3L4 8v8c0 7 5.4 11.9 12 14 6.6-2.1 12-7 12-14V8L16 3z"
            stroke={c} strokeWidth="2" strokeLinejoin="round" />
          <path d="M11 16l3 3 7-7"
            stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'crypto':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="2" />
          <path d="M13 10h6a3 3 0 010 6h-6m0 0h7a3 3 0 010 6h-7m0-12v12m2-14v2m3-2v2m-3 12v2m3-2v2"
            stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'a2a':
      return (
        <svg {...common}>
          <circle cx="8"  cy="16" r="5" stroke={c} strokeWidth="2" />
          <circle cx="24" cy="16" r="5" stroke={c} strokeWidth="2" />
          <path d="M13 13l6-3M13 19l6 3" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default: return null;
  }
}

/* ── Screen helpers ── */
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
    <>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px 4px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 0 7px' }}>
        <span style={{
          color: '#fff',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #ffffff 0%, #7dd3fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>PAYPOS</span>
      </div>
      <div style={{ height: 1, margin: '0 10px', background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.35), transparent)' }} />
    </>
  );
}

function ScreenCell({ id, featured = false }) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;
  const iconSize  = featured ? 36 : 24;
  const labelSize = featured ? 9 : 8;
  return (
    <div className="pp-cell" style={{
      background: `${p.color}1A`,
      borderRadius: 8,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: featured ? 6 : 4,
      padding: featured ? '10px 6px' : '9px 6px 8px',
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
  return <div style={{ height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />;
}

/* ── Screen content per state ── */
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff', flexShrink: 0 }} />
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: '0.1em' }}>PAYPOS</div>
          </div>
        </div>
      </div>
    );
  }

  if (state === 1) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '8px 10px 6px', flex: '0 0 40%', display: 'flex' }}>
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
        <div style={{ padding: '8px 10px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: '0 0 28%' }}>
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
        <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 8, flex: 1 }}>
          <ScreenCell id="paybylink" />
          <ScreenCell id="bnpl" />
          <ScreenCell id="wero" />
          <div />
          <Placeholder /><Placeholder />
        </div>
      </div>
    );
  }

  if (state === 4) {
    return (
      <div style={inner}>
        <ScreenHeader time={time} />
        <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 8, flex: 1 }}>
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
        <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 8, flex: 1 }}>
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
      <div style={{ padding: '11px 10px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
        {PRODUCTS.map(p => <ScreenCell key={p.id} id={p.id} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 10px 10px' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4ff', animation: 'pp-dot-pulse 1.5s ease infinite' }} />
        <span style={{ color: '#00d4ff', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>6 MODULES ACTIFS</span>
      </div>
    </div>
  );
}

/* ── Grain + light bloom layer ── */
function GrainLayer({ intense }) {
  return (
    <div style={{
      position: 'absolute',
      left: -300, top: -350,
      width: 600, height: 700,
      pointerEvents: 'none',
      zIndex: 1,
    }}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="pp-grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        background: intense
          ? 'radial-gradient(ellipse 55% 65% at 50% 45%, rgba(0,212,255,0.20) 0%, rgba(60,120,255,0.10) 50%, transparent 100%)'
          : 'radial-gradient(ellipse 50% 60% at 50% 45%, rgba(120,180,255,0.12) 0%, rgba(60,120,255,0.06) 50%, transparent 100%)',
        mixBlendMode: 'screen',
        opacity: 0.8,
        animation: 'bloomPulse 5s ease-in-out infinite',
        transition: 'background 1s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        opacity: intense ? 0.09 : 0.04,
        mixBlendMode: 'screen',
        background: 'radial-gradient(ellipse at center, rgba(100,180,255,0.15) 0%, rgba(50,100,255,0.08) 40%, transparent 70%)',
        filter: 'url(#pp-grain-filter)',
        animation: 'grainDrift 8s ease-in-out infinite',
        transition: 'opacity 0.8s ease',
      }} />
    </div>
  );
}

/* ── Neon border that traces the screen perimeter ── */
function ScreenBorder({ intense }) {
  const W = SCREEN_WIDTH - 1;
  const H = SCREEN_HEIGHT - 1;
  const cometLen = intense ? SCREEN_PERIM : 80;
  return (
    <svg
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={{
        position: 'absolute',
        top: SCREEN_TOP, left: SCREEN_LEFT,
        transform: SCREEN_TRANSFORM,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 12,
        overflow: 'visible',
      }}
    >
      {intense && (
        <rect x="0.5" y="0.5" width={W} height={H} rx={SCREEN_RADIUS}
          fill="none" stroke="rgba(0,212,255,0.30)" strokeWidth="1" />
      )}
      <rect x="0.5" y="0.5" width={W} height={H} rx={SCREEN_RADIUS}
        fill="none"
        stroke="#00d4ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${cometLen} ${SCREEN_PERIM - cometLen + 1}`}
        style={{
          animation: `borderTrace ${intense ? 1.8 : 3}s linear infinite`,
          filter: intense
            ? 'drop-shadow(0 0 4px #00d4ff) drop-shadow(0 0 8px rgba(0,212,255,0.6))'
            : 'drop-shadow(0 0 3px #00d4ff)',
        }}
      />
    </svg>
  );
}

/* ── Terminal image + screen overlay ── */
function TerminalInner({ activeState, time, intense, pulseRef }) {
  return (
    <div style={{ position: 'relative', width: TERMINAL_WIDTH }}>
      <img
        src={`${import.meta.env.BASE_URL}${TERMINAL_IMG}`}
        alt="PayPOS Terminal"
        style={{
          width: TERMINAL_WIDTH,
          height: 'auto',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          filter: intense
            ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 30px rgba(0,150,255,0.4))'
            : 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
          transition: 'filter 1s ease',
        }}
      />
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
        transform: SCREEN_TRANSFORM,
        transformOrigin: 'center center',
        boxShadow: intense
          ? '0 0 0 1px rgba(0,212,255,0.5), 0 0 40px 6px rgba(0,212,255,0.35), inset 0 0 12px rgba(0,212,255,0.15)'
          : 'inset 0 0 8px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.6s ease',
      }}>
        <ScreenContent state={activeState} time={time} />
        <div
          key={activeState}
          className="pp-flash"
          style={{
            background: activeState === 0
              ? 'rgba(255,255,255,0.6)'
              : PRODUCTS[Math.min(activeState - 1, PRODUCTS.length - 1)].color,
          }}
        />
        <div ref={pulseRef} style={S.screenPulse} />
      </div>
      <ScreenBorder intense={intense} />
    </div>
  );
}

/* Mobile entry */
function TerminalWithScreen({ activeState, time, scale = 1 }) {
  const intense = activeState === 6;
  return (
    <div style={{
      position: 'relative',
      width: TERMINAL_WIDTH,
      transform: `scale(${scale})`,
      transformOrigin: 'center top',
      animation: 'terminalFloat 3s ease-in-out infinite',
    }}>
      <TerminalInner activeState={activeState} time={time} intense={intense} pulseRef={{ current: null }} />
    </div>
  );
}

/* ── Main component ── */
export default function PayPOSHero() {
  const sectionRef   = useRef(null);
  const terminalRef  = useRef(null);
  const pulseRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const ctaRef       = useRef(null);
  const cardRefs     = useRef([]);
  const linePathRefs = useRef([]);
  const absorbedRef  = useRef(new Set());

  const [isMobile,      setIsMobile]      = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [absorbedIds,   setAbsorbedIds]   = useState(new Set());
  const [electricPaths, setElectricPaths] = useState([]);
  const [cardLayout,    setCardLayout]    = useState(null);

  const time        = useFrenchTime();
  const activeState = absorbedIds.size;
  const intense     = activeState === 6;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const h  = e => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let ctx;
    let cancelled = false;
    const delay = ms => new Promise(r => setTimeout(r, ms));

    const run = async () => {
      await delay(100);
      if (cancelled) return;

      const section  = sectionRef.current;
      const terminal = terminalRef.current;
      if (!section || !terminal) return;

      const sRect = section.getBoundingClientRect();
      const tRect = terminal.getBoundingClientRect();
      const tLeft = tRect.left - sRect.left;
      const tTop  = tRect.top  - sRect.top;

      const scrLeft  = tLeft  + SCREEN_LEFT;
      const scrRight = scrLeft + SCREEN_WIDTH;
      const scrTop   = tTop   + SCREEN_TOP;
      const rowMids  = [
        scrTop + SCREEN_HEIGHT / 6,
        scrTop + SCREEN_HEIGHT / 2,
        scrTop + SCREEN_HEIGHT * 5 / 6,
      ];

      flushSync(() => setCardLayout({ scrLeft, scrRight, rowMids, sectionWidth: sRect.width }));
      await delay(16);
      if (cancelled) return;

      const freshSRect = section.getBoundingClientRect();
      const paths = PRODUCTS.map((p, i) => {
        const card = cardRefs.current[i];
        if (!card) return null;
        const cRect = card.getBoundingClientRect();
        const cx  = cRect.left - freshSRect.left + cRect.width  / 2;
        const cy  = cRect.top  - freshSRect.top  + cRect.height / 2;
        const row = Math.floor(i / 2);
        const ey  = rowMids[row];
        const ex  = p.ox < 0 ? scrLeft : scrRight;
        const dx  = ex - cx;
        const cp1x = cx + dx * 0.5;
        const cp2x = ex - dx * 0.5;
        return `M ${cx.toFixed(1)} ${cy.toFixed(1)} C ${cp1x.toFixed(1)} ${cy.toFixed(1)}, ${cp2x.toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      });

      flushSync(() => setElectricPaths(paths));
      await delay(16);
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.to(terminal, { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin:     true,
            start:   'top top',
            end:     `+=${END_SCROLL}`,
            scrub:   1.5,
            anticipatePin: 1,
            onUpdate: self => {
              let changed = false;
              PRODUCTS.forEach((p, i) => {
                const threshold  = (i * PRODUCT_DUR + PHASE1 + PHASE2) / TOTAL_DUR;
                const shouldBeOn = self.progress >= threshold;
                const isOn       = absorbedRef.current.has(p.id);
                if (shouldBeOn && !isOn)  { absorbedRef.current.add(p.id);    changed = true; }
                if (!shouldBeOn && isOn)  { absorbedRef.current.delete(p.id); changed = true; }
              });
              if (changed) setAbsorbedIds(new Set(absorbedRef.current));
            },
          },
        });

        const pulse = pulseRef.current;

        PRODUCTS.forEach((p, i) => {
          const card = cardRefs.current[i];
          const lp   = linePathRefs.current[i];
          if (!card || !lp) return;

          const len = lp.getTotalLength();
          gsap.set(lp,   { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
          gsap.set(card, { opacity: 1, scale: 1, x: 0, y: 0 });

          const at       = i * PRODUCT_DUR;
          const impactAt = at + PHASE1 + PHASE2 * 0.85;

          // Phase 1: line draws in
          tl.to(lp, { opacity: 1, strokeDashoffset: 0, duration: PHASE1, ease: 'power2.in' }, at);

          // Phase 2: card flies along path and shrinks into terminal
          tl.to(card, {
            motionPath: { path: lp, align: lp, alignOrigin: [0.5, 0.5], autoRotate: false },
            scale:   0.2,
            opacity: 0,
            duration: PHASE2,
            ease: 'power2.inOut',
          }, at + PHASE1);

          // Terminal impact
          if (pulse) {
            tl.to(pulse, { opacity: 0.55, duration: 0.06 }, impactAt);
            tl.to(pulse, { opacity: 0,    duration: 0.40 }, impactAt + 0.06);
          }
          tl.to(terminal, { scaleX: 1.04, scaleY: 0.98, duration: 0.07, ease: 'power3.out',           transformOrigin: 'center bottom' }, impactAt);
          tl.to(terminal, { scaleX: 1.00, scaleY: 1.00, duration: 0.35, ease: 'elastic.out(1.1, 0.4)', transformOrigin: 'center bottom' }, impactAt + 0.07);

          // Phase 4: line fades out
          tl.to(lp, { opacity: 0, duration: PHASE4, ease: 'power1.out' }, at + PHASE1 + PHASE2);
        });

        tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, TOTAL_DUR - 1.5);
        tl.fromTo(ctaRef.current,      { opacity: 0 },         { opacity: 1, duration: 0.4 },       TOTAL_DUR - 0.8);
      }, section);
    };

    const handleResize = () => {
      if (cancelled) return;
      ctx?.revert();
      ctx = undefined;
      setCardLayout(null);
      setElectricPaths([]);
      absorbedRef.current = new Set();
      setAbsorbedIds(new Set());
      run();
    };

    run();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      ctx?.revert();
    };
  }, [isMobile]);

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <section style={{ ...S.root, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '80px 24px', overflow: 'visible' }}>
        <GlobalStyles />
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={S.eyebrow} className="pp-eyebrow">Next-Gen Payment Terminal</span>
          <div style={S.eyebrowLine} />
          <h1 style={{ ...S.h1, fontSize: 'clamp(36px,10vw,56px)' }}>
            <span style={S.gradientH1}>One Terminal.</span><br />Every Payment.
          </h1>
          <p style={S.subtitle}>
            PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
          </p>
          <button style={{ ...S.ctaBtn, alignSelf: 'center' }} className="pp-cta-btn">
            Découvrir PayPOS →
          </button>
        </div>
        <TerminalWithScreen activeState={6} time={time} scale={0.78} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ ...S.card, borderRadius: 14, padding: '11px 14px' }}>
              <div style={{ ...S.iconBox, background: `${p.color}1A` }}>
                <ProductIcon id={p.id} size={18} />
              </div>
              <span style={{ ...S.cardLabel, fontSize: 12 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Desktop layout ── */
  return (
    <section ref={sectionRef} style={S.root}>
      <GlobalStyles />

      <div style={S.atmo1} />
      <div style={S.atmo3} />

      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute', left: p.l, top: p.t,
            width: p.size, height: p.size, borderRadius: '50%',
            background: '#fff', opacity: p.op,
            animation: `particleFloat ${p.dur}s ease-in-out ${p.del}s infinite`,
            pointerEvents: 'none', zIndex: 2,
          }}
        />
      ))}

      <div style={S.textBlock}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={S.eyebrow} className="pp-eyebrow">Next-Gen Payment Terminal</span>
          <div style={S.eyebrowLine} />
        </div>
        <h1 style={{ ...S.h1, marginBottom: 0 }}>
          <span style={S.gradientH1}>One Terminal.</span>
          <br />Every Payment.
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {PRODUCTS.map((_, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: activeState > i ? '#00d4ff' : 'rgba(255,255,255,0.35)',
                boxShadow: activeState > i ? '0 0 10px #00d4ff' : 'none',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
              }} />
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.04em' }}>
            {activeState} / 6 modules actifs
          </span>
        </div>
        <p ref={subtitleRef} style={{ ...S.subtitle, opacity: 0 }}>
          PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
        </p>
        <button ref={ctaRef} style={{ ...S.ctaBtn, opacity: 0 }} className="pp-cta-btn">
          Découvrir PayPOS →
        </button>
      </div>

      {/* Electric neon lines SVG overlay */}
      <svg style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 5,
        overflow: 'visible',
      }}>
        {electricPaths.map((d, i) => d && (
          <path
            key={PRODUCTS[i].id}
            ref={el => { linePathRefs.current[i] = el; }}
            d={d}
            stroke={PRODUCTS[i].color}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${PRODUCTS[i].color})`, opacity: 0 }}
          />
        ))}
      </svg>

      {/* Product cards at section level */}
      {cardLayout && PRODUCTS.map((p, i) => {
        const row    = Math.floor(i / 2);
        const isLeft = p.ox < 0;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: cardLayout.rowMids[row] - CARD_H_EST / 2,
              ...(isLeft
                ? { right: cardLayout.sectionWidth - cardLayout.scrLeft + 16 }
                : { left: cardLayout.scrRight + 16 }
              ),
              zIndex: 8,
            }}
          >
            <div ref={el => { cardRefs.current[i] = el; }} style={{ ...S.card, borderTopColor: `${p.color}55` }}>
              <div style={{ ...S.iconBox, background: `${p.color}1A` }}>
                <ProductIcon id={p.id} size={20} />
              </div>
              <span style={S.cardLabel}>{p.label}</span>
            </div>
          </div>
        );
      })}

      {/* Orbital zone — zero-size anchor at terminal center */}
      <div style={{
        position: 'absolute',
        right: `calc(${RIGHT_OFFSET_PCT * 100}% + ${THW}px)`,
        top: '50%',
        width: 0, height: 0,
      }}>
        <GrainLayer intense={intense} />

        <div style={{
          position: 'absolute',
          left: -THW,
          top: 0,
          transform: 'translateY(-50%)',
          width: TERMINAL_WIDTH,
        }}>
          <div ref={terminalRef} style={{ willChange: 'transform', position: 'relative', zIndex: 6 }}>
            <TerminalInner activeState={activeState} time={time} intense={intense} pulseRef={pulseRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Styles ── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');

      @keyframes particleFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-9px); }
      }
      @keyframes terminalFloat {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes eyebrowIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes borderTrace {
        from { stroke-dashoffset: 1254; }
        to   { stroke-dashoffset: 0; }
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
      @keyframes pp-dot-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.4; transform: scale(0.7); }
      }
      @keyframes atmoBreath {
        0%, 100% { opacity: 0.8; }
        50%       { opacity: 1; }
      }
      @keyframes grainDrift {
        0%   { transform: translate(0px, 0px) scale(1); }
        25%  { transform: translate(-2px, 1px) scale(1.01); }
        50%  { transform: translate(1px, -2px) scale(0.99); }
        75%  { transform: translate(2px, 1px) scale(1.01); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      @keyframes bloomPulse {
        0%, 100% { opacity: 0.6; }
        50%       { opacity: 1; }
      }

      .pp-eyebrow { animation: eyebrowIn 0.6s ease both; }
      .pp-cta-btn:hover {
        transform: scale(1.03);
        box-shadow: 0 0 30px rgba(0,212,255,0.4);
      }
      .pp-flash {
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
  atmo1: {
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 60% at 65% 50%, rgba(0,100,255,0.15) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)',
  },
  atmo3: {
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 65% 50%, rgba(0,80,255,0.12) 0%, transparent 60%)',
    animation: 'atmoBreath 4s ease-in-out infinite',
  },
  textBlock: {
    position: 'absolute', left: '6%', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 460,
  },
  eyebrow: {
    color: '#00d4ff', fontSize: 12, fontWeight: 700,
    letterSpacing: '0.3em', textTransform: 'uppercase',
  },
  eyebrowLine: {
    width: '100%', height: 1,
    background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
    opacity: 0.5,
  },
  h1: {
    fontSize: 'clamp(38px,4.5vw,64px)', fontWeight: 800,
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
  },
  ctaBtn: {
    display: 'inline-block',
    background: '#00d4ff', color: '#000', fontWeight: 700,
    borderRadius: 100, padding: '14px 28px', border: 'none',
    fontSize: 15, letterSpacing: '0.02em',
    cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    willChange: 'transform',
    alignSelf: 'flex-start',
  },
  screenPulse: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(circle at 50% 45%, rgba(0,212,255,0.55) 0%, rgba(0,100,255,0.25) 50%, transparent 80%)',
    opacity: 0, pointerEvents: 'none', zIndex: 6,
  },
  card: {
    display: 'flex', alignItems: 'center', gap: 12,
    background:           'rgba(255,255,255,0.04)',
    border:               '1px solid rgba(255,255,255,0.12)',
    borderTopColor:       'rgba(0,212,255,0.3)',
    backdropFilter:       'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius:         20,
    padding:              '14px 20px',
    boxShadow:            '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)',
    willChange:           'transform',
    whiteSpace:           'nowrap',
    minWidth:             140,
  },
  iconBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,212,255,0.10)',
    borderRadius: 10, padding: 8, flexShrink: 0,
  },
  cardLabel: {
    color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em',
  },
};
