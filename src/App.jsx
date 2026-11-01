import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import PayPOSHero from './components/PayPOSHero';
import HomeSections from './components/HomeSections';
import PricingPage from './components/PricingPage';

const isPricingHash = hash => hash === '#/tarifs' || hash === '#tarifs';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => (isPricingHash(window.location.hash) ? 'tarifs' : 'home'));

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (isPricingHash(hash)) {
        setCurrentPage('tarifs');
        window.scrollTo(0, 0);
        return;
      }
      setCurrentPage('home');
      // In-page anchors (#produits, #contact…) scroll to their section once the home page is rendered.
      // Coming from /tarifs the hero is still laying out (its pin adds height), so wait a beat.
      const id = hash.slice(1);
      setTimeout(() => {
        const el = id && document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo(0, 0);
      }, 350);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPage === 'tarifs') {
    return (
      <>
        <CustomCursor />
        <PricingPage />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <PayPOSHero />
        <HomeSections />
      </main>
    </>
  );
}
