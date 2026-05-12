import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink',    icon: '🔗', pos: { top: '13%',   left: '6%'   } },
  { id: 'bnpl',      label: 'BNPL & Credit', icon: '💳', pos: { top: '13%',   right: '4%'  } },
  { id: 'wero',      label: 'Wero',          icon: '⚡',       pos: { top: '44%',   left: '4%'   } },
  { id: 'noshow',    label: 'NoShow',        icon: '🛡️', pos: { top: '44%', right: '3%' } },
  { id: 'crypto',    label: 'Crypto',        icon: '₿',       pos: { bottom: '11%', left: '6%'  } },
  { id: 'a2a',       label: 'A2A & Wallets', icon: '🏦', pos: { bottom: '11%', right: '4%' } },
];

const STEP     = 1.2;
const TOTAL    = PRODUCTS.length * STEP + 1;
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

  /* ── Mobile detection ── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const h  = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  /* ── GSAP (desktop only) ── */
  useEffect(() => {
    if (isMobile) return;

    let ctx;
    const timer = setTimeout(() => {
      const section  = sectionRef.current;
      const terminal = terminalRef.current;
      const glow     = glowRef.current;
      if (!section || !terminal || !glow) return;

      /* Measure before any animation modifies transforms */
      const sR  = section.getBoundingClientRect();
      const tR  = terminal.getBoundingClientRect();
      const tCX = tR.left - sR.left + tR.width  / 2;
      const tCY = tR.top  - sR.top  + tR.height / 2;

      const offsets = PRODUCTS.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: tCX - (r.left - sR.left + r.width  / 2),
          y: tCY - (r.top  - sR.top  + r.height / 2),
        };
      });

      ctx = gsap.context(() => {
        /* Floating terminal */
        gsap.to(terminal, {
          y: -18, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        /* Main scroll-driven timeline */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:       section,
            pin:           true,
            start:         'top top',
            end:           `+=${PRODUCTS.length * SCROLL_PX}`,
            scrub:         1,
            anticipatePin: 1,
            onUpdate: (self) => {
              let changed = false;
              PRODUCTS.forEach((p, i) => {
                const on  = ((i + 1) * STEP) / TOTAL;
                const off = (i * STEP) / TOTAL;
                if (self.progress >= on  && !absorbedRef.current.has(p.id)) {
                  absorbedRef.current.add(p.id); changed = true;
                } else if (self.progress < off && absorbedRef.current.has(p.id)) {
                  absorbedRef.current.delete(p.id); changed = true;
                }
              });
              if (changed) setAbsorbedIds(new Set(absorbedRef.current));
            },
          },
        });

        PRODUCTS.forEach((_, i) => {
          const card     = cardRefs.current[i];
          if (!card) return;
          const { x, y } = offsets[i];
          const at       = i * STEP;

          /* Card flies to terminal center and gets absorbed */
          tl.to(card,
            { x, y, scale: 0, opacity: 0, duration: 1, ease: 'power2.in' },
            at
          );
          /* Glow pulse on absorption */
          tl.to(glow, { opacity: 0.5, scale: 1.5, duration: 0.12, ease: 'power2.out' }, at + 0.85);
          tl.to(glow, { opacity: 0.1, scale: 1.0, duration: 0.15, ease: 'power2.in'  }, at + 0.97);
        });

        /* Subtitle reveal after last absorption */
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
          <img src="/devices6.png" alt="PayPOS Terminal" style={S.terminalImgMobile} />
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

  /* ─────────────────── Desktop layout ─────────────────── */
  return (
    <section ref={sectionRef} style={{ ...S.root, position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <FontImport />
      <PopInAnim />

      {/* Left text block */}
      <div style={S.desktopText}>
        <Eyebrow />
        <h1 style={S.h1Desktop}>One Terminal.<br />Every Payment.</h1>
        <p ref={subtitleRef} style={{ ...S.subtitle, opacity: 0 }}>
          PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
        </p>
      </div>

      {/* Glow — no CSS transform so GSAP scale works cleanly */}
      <div
        ref={glowRef}
        style={{
          position:        'absolute',
          width:           520,
          height:          520,
          borderRadius:    '50%',
          background:      'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)',
          right:           'calc(13% - 90px)',
          top:             'calc(50% - 260px)',
          opacity:         0.1,
          pointerEvents:   'none',
          transformOrigin: 'center center',
        }}
      />

      {/* Terminal positioning wrapper (CSS-only, no GSAP) */}
      <div style={S.terminalWrapper}>
        {/* GSAP-controlled inner div (floating animation) */}
        <div ref={terminalRef} style={{ width: 340, willChange: 'transform', position: 'relative' }}>
          <img
            src="/devices6.png"
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

      {/* Floating product cards */}
      {PRODUCTS.map((p, i) => (
        <div
          key={p.id}
          ref={el => { cardRefs.current[i] = el; }}
          style={{ ...S.card, position: 'absolute', zIndex: 8, ...p.pos }}
        >
          <span style={{ fontSize: 24 }}>{p.icon}</span>
          <span style={S.cardLabel}>{p.label}</span>
        </div>
      ))}
    </section>
  );
}

/* ── Tiny sub-components ── */
const Eyebrow = () => (
  <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
    Next-Gen Payment Terminal
  </span>
);

const FontImport = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');`}</style>
);

const PopInAnim = () => (
  <style>{`
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.4); }
      to   { opacity: 1; transform: scale(1);   }
    }
  `}</style>
);

/* ── Style constants ── */
const S = {
  root: {
    background: '#0a0a0f',
    fontFamily: 'Manrope, sans-serif',
  },
  mobileInner: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 32, padding: '80px 24px',
  },
  mobileText: {
    textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20,
  },
  mobileGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%',
  },
  desktopText: {
    position: 'absolute', left: '6%', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 460,
  },
  h1Mobile: {
    fontSize: 'clamp(36px,10vw,56px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.05, margin: 0,
  },
  h1Desktop: {
    fontSize: 'clamp(48px,5.5vw,80px)', fontWeight: 800,
    color: '#fff', lineHeight: 1.05, margin: 0,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)', fontSize: 17, lineHeight: 1.65, maxWidth: 400,
  },
  terminalWrapper: {
    position: 'absolute', right: '13%', top: '50%',
    transform: 'translateY(-50%)', zIndex: 5,
  },
  terminalImgMobile: {
    width: 240, height: 'auto', mixBlendMode: 'screen',
  },
  terminalImgDesktop: {
    width: '100%', height: 'auto', mixBlendMode: 'screen', display: 'block',
  },
  absorbedOverlay: {
    position: 'absolute', top: '18%', left: '12%', right: '12%', bottom: '18%',
    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
    justifyContent: 'center', gap: 8, zIndex: 6,
  },
  absorbedIcon: {
    fontSize: 22,
    animation: 'popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both',
  },
  card: {
    display: 'flex', alignItems: 'center', gap: 12,
    background:    'rgba(255,255,255,0.05)',
    border:        '1px solid rgba(255,255,255,0.1)',
    backdropFilter:'blur(10px)',
    borderRadius:  16,
    padding:       '16px 24px',
    willChange:    'transform',
  },
  cardLabel: {
    color: '#fff', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
  },
};
