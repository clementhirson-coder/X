import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import PayPOSHero from './components/PayPOSHero';
import PricingPage from './components/PricingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === '/tarifs' || hash === 'tarifs') {
        setCurrentPage('tarifs');
        window.scrollTo(0, 0);
      } else {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }
    };

    handleHashChange();
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
      </main>
    </>
  );
}
