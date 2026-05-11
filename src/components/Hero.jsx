import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { id: 'paybylink', label: 'PayByLink', icon: '🔗', pos: 'top-left' },
  { id: 'bnpl', label: 'BNPL & Credit', icon: '💳', pos: 'top-right' },
  { id: 'wero', label: 'Wero', icon: '⚡', pos: 'middle-left' },
  { id: 'noshow', label: 'NoShow', icon: '🛡️', pos: 'middle-right' },
  { id: 'crypto', label: 'Crypto', icon: '₿', pos: 'bottom-left' },
  { id: 'a2a', label: 'A2A & Wallets', icon: '🏦', pos: 'bottom-right' },
]

// Floating positions for each card (percentages relative to the stage)
// Each entry: { x: percent from center, y: percent from center }
const POSITIONS = {
  'top-left': { x: -38, y: -32 },
  'top-right': { x: 38, y: -32 },
  'middle-left': { x: -44, y: 0 },
  'middle-right': { x: 44, y: 0 },
  'bottom-left': { x: -38, y: 32 },
  'bottom-right': { x: 38, y: 32 },
}

export default function Hero() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const terminalRef = useRef(null)
  const glowRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardRefs = useRef([])
  const absorbedIconRefs = useRef([])
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useLayoutEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {
      // Subtle floating animation on terminal
      gsap.to(terminalRef.current, {
        y: -14,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      const cards = cardRefs.current.filter(Boolean)
      const absorbed = absorbedIconRefs.current.filter(Boolean)

      // Reset starting state for each card
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, scale: 1 })
      })
      absorbed.forEach((dot) => gsap.set(dot, { opacity: 0, scale: 0.4 }))
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 })

      const totalScroll = PRODUCTS.length * 120 + 400 // px

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      PRODUCTS.forEach((product, i) => {
        const card = cards[i]
        const dot = absorbed[i]
        const pos = POSITIONS[product.pos]

        tl.fromTo(
          card,
          { xPercent: pos.x, yPercent: pos.y, opacity: 1, scale: 1 },
          {
            keyframes: [
              { xPercent: pos.x, yPercent: pos.y, opacity: 1, scale: 1, duration: 0.05 },
              {
                xPercent: pos.x * 0.45,
                yPercent: pos.y * 0.55 + (pos.y > 0 ? -10 : 10),
                scale: 0.85,
                duration: 0.45,
                ease: 'power2.in',
              },
              {
                xPercent: 0,
                yPercent: 0,
                scale: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power3.in',
              },
            ],
          },
          i * 0.6,
        )
          // Terminal glow pulse on contact
          .to(
            glowRef.current,
            {
              keyframes: [
                { opacity: 0.45, scale: 1.15, duration: 0.18 },
                { opacity: 0.18, scale: 1, duration: 0.35, ease: 'power2.out' },
              ],
            },
            i * 0.6 + 0.85,
          )
          // Absorbed icon appears on terminal screen
          .to(
            dot,
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
            i * 0.6 + 0.9,
          )
      })

      // Subtitle reveal after all absorbed
      tl.to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        PRODUCTS.length * 0.6 + 0.2,
      )
    }, rootRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={rootRef}
      className="relative w-full h-screen overflow-hidden bg-ink font-manrope"
    >
      <div
        ref={stageRef}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Headline */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-30 text-center px-6 w-full max-w-4xl">
          <p
            className="text-[12px] mb-6"
            style={{
              letterSpacing: '0.3em',
              color: '#00d4ff',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Next-Gen Payment Terminal
          </p>
          <h1
            className="font-manrope font-bold text-white leading-[1.05]"
            style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 700 }}
          >
            One Terminal.
            <br />
            Every Payment.
          </h1>
          <p
            ref={subtitleRef}
            className="mt-8 mx-auto max-w-xl text-base md:text-lg"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            PayPOS centralise tous vos moyens de paiement en un seul terminal Android.
          </p>
        </div>

        {/* Terminal stage (slightly right-aligned) */}
        <div
          className="absolute top-1/2 left-1/2 z-10"
          style={{
            transform: 'translate(-42%, -42%)',
            width: 'min(900px, 90vw)',
            height: 'min(900px, 90vw)',
          }}
        >
          {/* Soft radial glow behind terminal */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(0,212,255,0.10) 0%, rgba(0,212,255,0.04) 35%, rgba(0,212,255,0) 70%)',
              filter: 'blur(20px)',
              willChange: 'transform, opacity',
              opacity: 0.18,
            }}
          />

          {/* Terminal image */}
          <div
            ref={terminalRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            <img
              src="/devices6.png"
              alt="PayPOS terminal"
              className="w-full h-full object-contain select-none pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
              draggable={false}
            />

            {/* Absorbed icons that appear on terminal screen */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: '38%', height: '24%' }}>
                <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 place-items-center">
                  {PRODUCTS.map((p, i) => (
                    <div
                      key={p.id}
                      ref={(el) => (absorbedIconRefs.current[i] = el)}
                      className="flex items-center justify-center text-base md:text-lg"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(0,212,255,0.18)',
                        border: '1px solid rgba(0,212,255,0.45)',
                        color: '#bff8ff',
                        opacity: 0,
                        willChange: 'transform, opacity',
                      }}
                    >
                      <span>{p.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product cards */}
        {!isMobile && (
          <div className="absolute top-1/2 left-1/2 z-20 pointer-events-none">
            {PRODUCTS.map((p, i) => {
              const pos = POSITIONS[p.pos]
              return (
                <div
                  key={p.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    transform: `translate(-50%, -50%) translate(${pos.x * 5}px, ${pos.y * 5}px)`,
                    willChange: 'transform, opacity',
                  }}
                >
                  <ProductCard product={p} />
                </div>
              )
            })}
          </div>
        )}

        {/* Mobile fallback grid */}
        {isMobile && (
          <div className="absolute bottom-8 left-0 right-0 px-6 grid grid-cols-2 gap-3 z-20">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        {!isMobile && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-[11px] tracking-[0.3em] uppercase text-white/40">
            Scroll to integrate
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <div
      className="flex items-center gap-3 whitespace-nowrap"
      style={{
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 16,
        color: '#fff',
        fontFamily: 'Manrope, system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 15,
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
      }}
    >
      <span className="text-xl leading-none">{product.icon}</span>
      <span>{product.label}</span>
    </div>
  )
}
