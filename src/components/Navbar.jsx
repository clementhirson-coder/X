import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'Produits',        href: '#produits' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Tarifs',          href: '#/tarifs' },
  { label: 'Contact',         href: '#contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeLink,  setActiveLink]  = useState('Produits');
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    el.style.transform = 'translateY(-100%)';
    el.style.opacity   = '0';
    const t = setTimeout(() => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border-bottom 0.3s ease, box-shadow 0.3s ease';
      el.style.transform  = 'translateY(0)';
      el.style.opacity    = '1';
    }, 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 80,
          padding: '0 60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: scrolled ? 'rgba(10,10,15,0.85)' : 'rgba(10,10,15,0.4)',
          borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }} data-cursor="hover">
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 25, letterSpacing: '0.05em' }}>
            PAYPOS
          </span>
          <span style={{
            display: 'inline-block',
            width: 6, height: 6, borderRadius: '50%',
            background: '#00d4ff',
            boxShadow: '0 0 8px #00d4ff',
            marginLeft: 4, marginBottom: 8,
          }} />
        </div>

        {/* Desktop nav links */}
        <div className="pp-nav-links" style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              data-cursor="hover"
              onClick={() => setActiveLink(link.label)}
              className={`pp-nav-link${activeLink === link.label ? ' pp-nav-link--active' : ''}`}
              style={{
                fontSize: 16, fontWeight: 500,
                color: activeLink === link.label ? '#fff' : 'rgba(255,255,255,0.6)',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: 5,
              }}
            >
              {link.label}
              {activeLink === link.label && (
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 2, background: '#00d4ff', borderRadius: 2,
                }} />
              )}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <button data-cursor="hover" className="pp-nav-cta" style={{
          background: 'transparent',
          border: '1px solid rgba(0,212,255,0.4)',
          color: '#00d4ff',
          fontSize: 16, fontWeight: 600,
          borderRadius: 100, padding: '12px 28px',
          fontFamily: 'Manrope, sans-serif',
        }}>
          Demander une démo
        </button>

        {/* Mobile hamburger */}
        <button
          className="pp-hamburger"
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'none', border: 'none',
            display: 'none', flexDirection: 'column', gap: 6, padding: 10,
          }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 28, height: 2, background: '#fff', borderRadius: 2 }} />
          ))}
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(10,10,15,0.98)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 40,
          fontFamily: 'Manrope, sans-serif',
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', top: 20, right: 24,
              background: 'none', border: 'none',
              color: '#fff', fontSize: 28, lineHeight: 1,
            }}
          >✕</button>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="pp-mobile-link"
              onClick={() => { setActiveLink(link.label); setMobileOpen(false); }}
              style={{
                fontSize: 24, fontWeight: 700,
                color: activeLink === link.label ? '#00d4ff' : '#fff',
                textDecoration: 'none',
              }}
            >{link.label}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .pp-nav-links { display: none !important; }
          .pp-nav-cta   { display: none !important; }
          .pp-hamburger { display: flex !important; }
        }
        .pp-nav-link { transition: color 0.2s; }
        .pp-nav-link:hover { color: #fff !important; }
        .pp-nav-cta {
          transition: all 0.2s ease;
        }
        .pp-nav-cta:hover {
          background: #00d4ff !important;
          color: #000 !important;
          box-shadow: 0 0 20px rgba(0,212,255,0.3) !important;
        }
        .pp-mobile-link { transition: color 0.2s; }
        .pp-mobile-link:hover { color: #00d4ff !important; }
      `}</style>
    </>
  );
}
