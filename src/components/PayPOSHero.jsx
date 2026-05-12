import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
   TERMINAL CROP — devices6.png is 1290×1470, smartphone on left,
   terminal on right. We crop to show ONLY the terminal.
   Tweak the constants below to fine-tune the crop & screen overlay.
   ───────────────────────────────────────────────────────────── */
const TW              = 360;     // terminal container width (display px)
const TH              = 620;     // terminal container height
const IMG_W           = 603;     // image rendered width (scaled from 1290)
const IMG_MARGIN_LEFT = -215;    // shift left to hide the smartphone
const IMG_MARGIN_TOP  = -30;     // vertical adjustment

/* Fake Android screen overlay — positioned over the terminal's actual screen */
const SCREEN_LEFT     = 67;
const SCREEN_TOP      = 64;
const SCREEN_WIDTH    = 247;
const SCREEN_HEIGHT   = 495;
const SCREEN_RADIUS   = 22;

const THW = TW / 2;

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',     short: 'Pay Link',  color: '#00d4ff', ox: -280, oy:  -80 },
  { id: 'bnpl',      label: 'BNPL & Credit', short: 'BNPL',      color: '#a855f7', ox:  220, oy:  -60 },
  { id: 'wero',      label: 'Wero',          short: 'Wero',      color: '#6366f1', ox: -300, oy:   60 },
  { id: 'noshow',    label: 'NoShow',        short: 'NoShow',    color: '#10b981', ox:  240, oy:   80 },
  { id: 'crypto',    label: 'Crypto',        short: 'Crypto',    color: '#f7931a', ox: -220, oy:  180 },
  { id: 'a2a',       label: 'A2A & Wallets', short: 'A2A',       color: '#3b82f6', ox:  200, oy:  160 },
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
  { id: 8,  size: 2, l: '41%', t: '34%', op: 0.30, dur: 6.0, del: -1.0 },
  { id: 9,  size: 2, l: '62%', t: '21%', op: 0.20, dur: 8.3, del: -6.0 },
  { id: 10, size: 3, l: '81%', t: '61%', op: 0.25, dur: 5.1, del: -3.0 },
  { id: 11, size: 2, l: '53%', t: '86%', op: 0.20, dur: 7.2, del: -2.5 },
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

/* ── Absorbed icons overlay — positioned inside the terminal's screen.
   Simple flex-wrap of small color-tinted tiles. No fake Android UI, just
   the icons that appeared as products got absorbed by scroll. ── */
function TerminalScreen({ absorbedIds }) {
  if (absorbedIds.size === 0) return null;
  return (
    <div style={S.absorbedOverlay}>
      {PRODUCTS.filter(p => absorbedIds.has(p.id)).map(p => (
        <div key={p.id} style={{ ...S.absorbedTile, background: `${p.color}26`, borderColor: `${p.color}55` }}>
          <ProductIcon id={p.id} size={18} />
        </div>
      ))}
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
        gsap.to(terminal, { y: -18, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

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
        <TerminalImage>
          <TerminalScreen absorbedIds={new Set(PRODUCTS.map(p => p.id))} />
        </TerminalImage>
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

        <div style={{
          position: 'absolute',
          left: -THW, top: -TH / 2,
          width: TW, height: TH,
        }}>
          <div ref={terminalRef} style={{ willChange: 'transform', position: 'relative', zIndex: 6, width: '100%', height: '100%' }}>
            <div style={S.glowRing} />
            <TerminalImage>
              <TerminalScreen absorbedIds={absorbedIds} />
              <div ref={pulseRef} style={S.screenPulse} />
            </TerminalImage>
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

/* ── Terminal image cropped to hide the smartphone ── */
function TerminalImage({ children }) {
  return (
    <div style={S.terminalCrop}>
      <img
        src={`${import.meta.env.BASE_URL}devices6.png`}
        alt="PayPOS Terminal"
        style={S.terminalImg}
      />
      {children}
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
      @keyframes eyebrowIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes appPopIn {
        from { opacity: 0; transform: scale(0.5); }
        to   { opacity: 1; transform: scale(1); }
      }
      .pp-eyebrow { animation: eyebrowIn 0.6s ease both; }
      .pp-app-in  { animation: appPopIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both; }
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
  glowRing: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: TW * 0.9, height: TW * 0.9, borderRadius: '50%',
    boxShadow: '0 0 80px 20px rgba(0,150,255,0.20)',
    pointerEvents: 'none', zIndex: 0,
  },
  svgLines: {
    position: 'absolute', left: 0, top: 0,
    pointerEvents: 'none', zIndex: 3,
  },

  /* Terminal image crop */
  terminalCrop: {
    position: 'relative',
    width: TW, height: TH,
    overflow: 'hidden',
    zIndex: 2,
  },
  terminalImg: {
    position: 'absolute',
    width: IMG_W,
    height: 'auto',
    left: IMG_MARGIN_LEFT,
    top: IMG_MARGIN_TOP,
    display: 'block',
    pointerEvents: 'none',
    userSelect: 'none',
  },

  /* Absorbed icons overlay — positioned over the terminal's screen */
  absorbedOverlay: {
    position: 'absolute',
    left: SCREEN_LEFT, top: SCREEN_TOP,
    width: SCREEN_WIDTH, height: SCREEN_HEIGHT,
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 12,
    zIndex: 5,
    pointerEvents: 'none',
  },
  absorbedTile: {
    width: 36, height: 36,
    borderRadius: 9,
    border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'appPopIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  screenPulse: {
    position: 'absolute',
    left: SCREEN_LEFT, top: SCREEN_TOP,
    width: SCREEN_WIDTH, height: SCREEN_HEIGHT,
    borderRadius: SCREEN_RADIUS,
    background: 'radial-gradient(circle at 50% 45%, rgba(0,212,255,0.55) 0%, rgba(0,100,255,0.25) 50%, transparent 80%)',
    opacity: 0, pointerEvents: 'none', zIndex: 6,
    mixBlendMode: 'screen',
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
