import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const state   = useRef({ mx: -100, my: -100, rx: -100, ry: -100, hover: false, clicking: false, raf: null });

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      state.current.mx = e.clientX;
      state.current.my = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor="hover"]');
      const isHover = !!el;
      if (isHover !== state.current.hover) {
        state.current.hover = isHover;
        ring.style.width  = isHover ? '44px' : '32px';
        ring.style.height = isHover ? '44px' : '32px';
        ring.style.borderColor = isHover ? '#00d4ff' : 'rgba(255,255,255,0.5)';
        ring.style.opacity = isHover ? '1' : '0.7';
      }
    };

    const onDown = () => {
      state.current.clicking = true;
      dot.style.transform  = `translate(${state.current.mx}px, ${state.current.my}px) scale(0.5)`;
      ring.style.transform = `translate(${state.current.rx - 16}px, ${state.current.ry - 16}px) scale(0.85)`;
    };

    const onUp = () => {
      state.current.clicking = false;
      dot.style.transform = `translate(${state.current.mx}px, ${state.current.my}px) scale(1)`;
    };

    const onLeave = () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };

    const onEnter = () => {
      dot.style.opacity  = '1';
      ring.style.opacity = state.current.hover ? '1' : '0.7';
    };

    const loop = () => {
      const s = state.current;
      s.rx += (s.mx - s.rx) * 0.12;
      s.ry += (s.my - s.ry) * 0.12;
      if (!s.clicking) {
        const hw = parseFloat(ring.style.width  || '32') / 2;
        const hh = parseFloat(ring.style.height || '32') / 2;
        ring.style.transform = `translate(${s.rx - hw}px, ${s.ry - hh}px)`;
      }
      s.raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove',   onMove,  { passive: true });
    document.addEventListener('mouseover',   onOver);
    document.addEventListener('mousedown',   onDown);
    document.addEventListener('mouseup',     onUp);
    document.addEventListener('mouseleave',  onLeave);
    document.addEventListener('mouseenter',  onEnter);
    state.current.raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(state.current.raf);
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 6px #00d4ff',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-100px, -100px)',
          marginLeft: -3, marginTop: -3,
          transition: 'transform 0.05s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Ring — lerp */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-100px, -100px)',
          opacity: 0.7,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
