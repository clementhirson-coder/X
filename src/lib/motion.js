import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll motion for a section, scoped to `scopeRef`:
 *  - [data-reveal]           fades/slides in when it enters the viewport (batched → natural stagger)
 *  - [data-reveal="scale"]   same, with a slight scale-up
 *  - [data-count="12.5"]     counts up to the value (data-decimals, data-prefix, data-suffix)
 *  - [data-line]             a horizontal rule that draws from the left
 * Everything is skipped under prefers-reduced-motion: content stays visible and static.
 */
export function useSectionMotion(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(scope);

      const items = q('[data-reveal]');
      gsap.set(items, { opacity: 0, y: 32 });
      gsap.set(q('[data-reveal="scale"]'), { scale: 0.94 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true,
        }),
      });

      q('[data-line]').forEach(el => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, {
          scaleX: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      q('[data-count]').forEach(el => {
        const end = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const fmt = v => `${el.dataset.prefix || ''}${v.toFixed(decimals).replace('.', ',')}${el.dataset.suffix || ''}`;
        const obj = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(obj, {
          v: end, duration: 1.6, ease: 'power3.out',
          onUpdate: () => { el.textContent = fmt(obj.v); },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}

/** Pointer-following spotlight: sets --mx / --my (px) on the hovered card. */
export function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}
