import Hero from './components/Hero.jsx'

export default function App() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <Hero />
      <section className="min-h-screen flex items-center justify-center px-6">
        <p className="max-w-2xl text-center text-white/50">
          Continuez à explorer PayPOS — la suite de paiements unifiée.
        </p>
      </section>
    </main>
  )
}
