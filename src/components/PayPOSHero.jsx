import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
   TERMINAL — Verifone product photo, transparent bg, screen black.
   terminal-photo.png is 1020×966 native; displayed at TW wide
   (height scales proportionally → 480×456 displayed).
   ───────────────────────────────────────────────────────────── */
const TERMINAL_WIDTH = 480;
const TERMINAL_IMG   = 'terminal-photo.png';

/* ──────────────────────────────────────────────────────────────
   FAKE SCREEN OVERLAY — locked values from design handoff.
   Transform matches the terminal's perspective angle in the photo.
   ───────────────────────────────────────────────────────────── */
const SCREEN_LEFT      = 180;
const SCREEN_TOP       = 39;
const SCREEN_WIDTH     = 154;
const SCREEN_HEIGHT    = 381;
const SCREEN_RADIUS    = 7;
const SCREEN_TRANSFORM = 'perspective(420px) rotateY(5.5deg) rotateX(-0.5deg)';

const THW = TERMINAL_WIDTH / 2;

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',     short: 'PAY-BY-LINK', color: '#00d4ff', ox: -280, oy:  -80 },
  { id: 'bnpl',      label: 'BNPL & Credit', short: 'BNPL',        color: '#a855f7', ox:  220, oy:  -60 },
  { id: 'wero',      label: 'Wero',          short: 'WERO',        color: '#6366f1', ox: -300, oy:   60 },
  { id: 'noshow',    label: 'NoShow',        short: 'NOSHOW',      color: '#10b981', ox:  240, oy:   80 },
  { id: 'crypto',    label: 'Crypto',        short: 'CRYPTO',      color: '#f7931a', ox: -220, oy:  180 },
  { id: 'a2a',       label: 'A2A & Wallets', short: 'A2A',         color: '#3b82f6', ox:  200, oy:  160 },
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

const STEP      = 1.2;
const TOTAL     = PRODUCTS.length * STEP + 1;
const SCROLL_PX = 140;

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
      {/* Status bar — même disposition que l'écran de boot */}
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
      {/* PAYPOS centré */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }} />
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.12em' }}>PAYPOS</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: '0.06em' }}>{time}</div>
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

export default function PayPOSHero() {
  const sectionRef  = useRef(null);
  const terminalRef = useRef(null);
  const glowRef     = useRef(null);
  const pulseRef    = useRef(null);
  const subtitleRef = useRef(null);
  const cardRefs    = useRef([]);
  const absorbedRef = useRef(new Set());

  const [isMobile,    setIsMobile]    = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [absorbedIds, setAbsorbedIds] = useState(new Set());
  const time = '09:52 am';
  const activeState = absorbedIds.size;
  const intense = activeState === 6;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const h  = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let ctx;
    const timer = setTimeout(() => {
      const section  = sectionRef.current;
      const terminal = terminalRef.current;
      const glow     = glowRef.current;
      if (!section || !terminal || !glow) return;

      ctx = gsap.context(() => {
        gsap.to(terminal, { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin:     true,
            start:   'top top',
            end:     `+=${PRODUCTS.length * SCROLL_PX}`,
            scrub:   1,
            anticipatePin: 1,
            onUpdate: (self) => {
              let changed = false;
              PRODUCTS.forEach((p, i) => {
                const on  = ((i + 1) * STEP) / TOTAL;
                const off = (i       * STEP) / TOTAL;
                if (self.progress >= on  && !absorbedRef.current.has(p.id)) { absorbedRef.current.add(p.id);    changed = true; }
                if (self.progress <  off &&  absorbedRef.current.has(p.id)) { absorbedRef.current.delete(p.id); changed = true; }
              });
              if (changed) setAbsorbedIds(new Set(absorbedRef.current));
            },
          },
        });

        const pulse = pulseRef.current;

        PRODUCTS.forEach((p, i) => {
          const card = cardRefs.current[i];
          if (!card) return;
          const at = i * STEP;

          tl.to(card, { x: -p.ox, y: -p.oy, scale: 0, opacity: 0, duration: 1, ease: 'power2.in' }, at);

          tl.to(terminal, { scaleX: 1.06, scaleY: 0.97, duration: 0.07, ease: 'power3.out', transformOrigin: 'center bottom' }, at + 0.85);
          tl.to(terminal, { scaleX: 1.00, scaleY: 1.00, duration: 0.45, ease: 'elastic.out(1.1, 0.4)', transformOrigin: 'center bottom' }, at + 0.92);

          if (pulse) {
            tl.to(pulse, { opacity: 0.55, duration: 0.06, ease: 'power2.out' }, at + 0.85);
            tl.to(pulse, { opacity: 0,    duration: 0.40, ease: 'power2.in'  }, at + 0.91);
          }

          tl.to(glow, { opacity: 0.55, scale: 1.7, duration: 0.12, ease: 'power2.out' }, at + 0.85);
          tl.to(glow, { opacity: 0.15, scale: 1.0, duration: 0.15, ease: 'power2.in'  }, at + 0.97);
        });

        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          PRODUCTS.length * STEP + 0.2
        );
      }, section);
    }, 150);

    return () => { clearTimeout(timer); ctx?.revert(); };
  }, [isMobile]);

  /* ─────────────────── Mobile layout ─────────────────── */
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

  return (
    <section ref={sectionRef} style={S.root}>
      <GlobalStyles />

      <div style={S.atmo1} />
      <div style={S.atmo2} />

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
        <h1 style={S.h1}>
          <span style={S.gradientH1}>One Terminal.</span>
          <br />Every Payment.
        </h1>
        <p ref={subtitleRef} style={{ ...S.subtitle, opacity: 0 }}>
          PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
        </p>
      </div>

      {/* Orbital zone — zero-size anchor at terminal center */}
      <div style={{
        position: 'absolute',
        right: `calc(13% + ${THW}px)`,
        top: '50%',
        width: 0, height: 0,
      }}>
        <div ref={glowRef} style={S.glowAtmo} />

        <svg width="0" height="0" style={S.svgLines} overflow="visible">
          <defs>
            <style>{`
              .dash { animation: dashFlow 3s linear infinite; }
              @keyframes dashFlow { to { stroke-dashoffset: -36; } }
            `}</style>
          </defs>
          {PRODUCTS.map(p => (
            <line
              key={p.id}
              x1={p.ox} y1={p.oy} x2={0} y2={0}
              stroke="rgba(0,212,255,0.15)"
              strokeDasharray="4 8"
              strokeWidth="1"
              className="dash"
            />
          ))}
        </svg>

        {/* Terminal centered on the orbital anchor */}
        <div style={{
          position: 'absolute',
          left: -THW, top: '-50%',
          transform: 'translateY(-50%)',
          width: TERMINAL_WIDTH,
        }}>
          <div ref={terminalRef} style={{ willChange: 'transform', position: 'relative', zIndex: 6 }}>
            <TerminalInner activeState={activeState} time={time} intense={intense} pulseRef={pulseRef} />
          </div>
        </div>

        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.ox, top: p.oy,
              transform: 'translate(-50%, -50%)',
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
        ))}
      </div>
    </section>
  );
}

/* ── Terminal image + screen overlay ── */
function TerminalInner({ activeState, time, intense, pulseRef }) {
  return (
    <div style={{ position: 'relative', width: TERMINAL_WIDTH }}>
      {/* Soft glow behind terminal */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '130%', height: '110%',
        background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <img
        src={`${import.meta.env.BASE_URL}${TERMINAL_IMG}`}
        alt="PayPOS Terminal"
        style={{
          width: TERMINAL_WIDTH,
          height: 'auto',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
        }}
      />

      {/* Fake screen overlay — transform matches terminal photo angle */}
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
      @keyframes pp-scanline {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(266%); }
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

      .pp-eyebrow { animation: eyebrowIn 0.6s ease both; }
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
  atmo2: {
    position: 'absolute', zIndex: 1, pointerEvents: 'none',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,180,255,0.20) 0%, transparent 70%)',
    right: `calc(13% + ${THW - 150}px)`,
    top: 'calc(50% - 150px)',
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
    fontSize: 'clamp(48px,5.5vw,80px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.05, margin: 0,
  },
  gradientH1: {
    background: 'linear-gradient(135deg, #ffffff 0%, #a8d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 400,
  },
  glowAtmo: {
    position: 'absolute',
    width: 520, height: 520, left: -260, top: -260,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
    opacity: 0.15, pointerEvents: 'none',
    transformOrigin: 'center center',
    zIndex: 3,
  },
  svgLines: {
    position: 'absolute', left: 0, top: 0,
    pointerEvents: 'none', zIndex: 3,
  },
  screenPulse: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(circle at 50% 45%, rgba(0,212,255,0.55) 0%, rgba(0,100,255,0.25) 50%, transparent 80%)',
    opacity: 0, pointerEvents: 'none', zIndex: 6,
  },
  card: {
    display: 'flex', alignItems: 'center', gap: 12,
    background:          'rgba(255,255,255,0.04)',
    border:              '1px solid rgba(255,255,255,0.12)',
    borderTopColor:      'rgba(0,212,255,0.3)',
    backdropFilter:      'blur(20px)',
    WebkitBackdropFilter:'blur(20px)',
    borderRadius:        20,
    padding:             '14px 20px',
    boxShadow:           '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)',
    willChange:          'transform',
    whiteSpace:          'nowrap',
  },
  iconBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,212,255,0.10)',
    borderRadius: 10, padding: 8, flexShrink: 0,
  },
  cardLabel: {
    color: '#fff', fontWeight: 600, fontSize: 13, letterSpacing: '0.02em',
  },
};
