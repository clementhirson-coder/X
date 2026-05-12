import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TW   = 391;      // terminal width = 340 * 1.15
const THW  = TW / 2;  // half terminal width = 195.5

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',     icon: '🔗', ox: -280, oy:  -80 },
  { id: 'bnpl',      label: 'BNPL & Credit', icon: '💳', ox:  220, oy:  -60 },
  { id: 'wero',      label: 'Wero',           icon: '⚡',       ox: -300, oy:   60 },
  { id: 'noshow',    label: 'NoShow',         icon: '🛡️', ox: 240, oy: 80 },
  { id: 'crypto',    label: 'Crypto',         icon: '₿',       ox: -220, oy:  180 },
  { id: 'a2a',       label: 'A2A & Wallets',  icon: '🏦', ox:  200, oy:  160 },
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

export default function PayPOSHero() {
  const sectionRef  = useRef(null);
  const terminalRef = useRef(null);
  const glowRef     = useRef(null);
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
        /* Floating terminal */
        gsap.to(terminal, { y: -18, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });

        /* Scroll timeline */
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

        PRODUCTS.forEach((p, i) => {
          const card = cardRefs.current[i];
          if (!card) return;
          const at = i * STEP;
          tl.to(card, { x: -p.ox, y: -p.oy, scale: 0, opacity: 0, duration: 1, ease: 'power2.in' }, at);
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
      <section style={S.root}>
        <FontImport />
        <div style={S.mobileInner}>
          <div style={S.mobileText}>
            <Eyebrow />
            <h1 style={S.h1Mobile}>One Terminal.<br />Every Payment.</h1>
            <p style={S.subtitle}>
              PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
            </p>
          </div>
          <img src={`${import.meta.env.BASE_URL}devices6.png`} alt="PayPOS Terminal" style={S.terminalImgMobile} />
          <div style={S.mobileGrid}>
            {PRODUCTS.map(p => (
              <div key={p.id} style={{ ...S.card, borderRadius: 12, padding: '12px 16px' }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <span style={{ ...S.cardLabel, fontSize: 12 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={S.root}>
      <GlobalStyles />

      {/* Atmosphere layer 1 — large ellipse */}
      <div style={S.atmo1} />
      {/* Atmosphere layer 2 — tight center glow */}
      <div style={S.atmo2} />

      {/* Floating particles */}
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

      {/* ── Left: headline ── */}
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

      {/* ── Orbital zone — zero-size anchor at terminal center ── */}
      <div style={{
        position: 'absolute',
        right: `calc(13% + ${THW}px)`,
        top: '50%',
        width: 0, height: 0,
      }}>

      {/* Terminal positioning wrapper (CSS-only, no GSAP) */}
      <div style={S.terminalWrapper}>
        {/* GSAP-controlled inner div (floating animation) */}
        <div ref={terminalRef} style={{ width: 340, willChange: 'transform', position: 'relative' }}>
          <img
            src={`${import.meta.env.BASE_URL}devices6.png`}
            alt="PayPOS Terminal"
            style={S.terminalImgDesktop}
          />
          {/* Icons absorbed into terminal screen */}
          {absorbedIds.size > 0 && (
            <div style={S.absorbedOverlay}>
              {PRODUCTS.filter(p => absorbedIds.has(p.id)).map(p => (
                <span key={p.id} style={S.absorbedIcon}>{p.icon}</span>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* SVG connecting lines from each card to terminal center */}
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

        {/* Terminal centering wrapper (translateY-50% only — GSAP on inner div) */}
        <div style={{
          position: 'absolute',
          left: -THW, top: 0,
          transform: 'translateY(-50%)',
          width: TW,
        }}>
          {/* GSAP-controlled: floating animation */}
          <div ref={terminalRef} style={{ willChange: 'transform', position: 'relative', zIndex: 6 }}>
            {/* Glow ring inside terminal — floats with it */}
            <div style={S.glowRing} />
            <img
              src={`${import.meta.env.BASE_URL}devices6.png`}
              alt="PayPOS Terminal"
              style={{ width: '100%', height: 'auto', mixBlendMode: 'screen', display: 'block', position: 'relative', zIndex: 1 }}
            />
            {/* Icons absorbed into terminal */}
            {absorbedIds.size > 0 && (
              <div style={S.absorbedOverlay}>
                {PRODUCTS.filter(p => absorbedIds.has(p.id)).map(p => (
                  <span key={p.id} style={S.absorbedIcon}>{p.icon}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards at orbital positions */}
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
            {/* inner div = GSAP target (no initial CSS transform) */}
            <div ref={el => { cardRefs.current[i] = el; }} style={S.card}>
              <div style={S.iconBox}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{p.icon}</span>
              </div>
              <span style={S.cardLabel}>{p.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Mobile fallback ── */
function MobileHero() {
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
      <img src={`${import.meta.env.BASE_URL}devices6.png`} alt="PayPOS Terminal" style={{ width: 240, mixBlendMode: 'screen' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ ...S.card, borderRadius: 14, padding: '11px 14px' }}>
            <div style={{ ...S.iconBox, borderRadius: 8, padding: 6 }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
            </div>
            <span style={{ ...S.cardLabel, fontSize: 12 }}>{p.label}</span>
          </div>
        ))}
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
      @keyframes eyebrowIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.4); }
        to   { opacity: 1; transform: scale(1); }
      }
      .pp-eyebrow { animation: eyebrowIn 0.6s ease both; }
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
    /* centered on terminal: right offset = 13% + HW - 150  */
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
  /* Glow: positioned with left/top (no CSS transform) so GSAP scale has no conflict */
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
  glowRing: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280, height: 280, borderRadius: '50%',
    boxShadow: '0 0 80px 20px rgba(0,150,255,0.20)',
    pointerEvents: 'none', zIndex: 0,
  },
  absorbedOverlay: {
    position: 'absolute', top: '18%', left: '12%', right: '12%', bottom: '18%',
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, zIndex: 7,
  },
  absorbedIcon: {
    fontSize: 22,
    animation: 'popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both',
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