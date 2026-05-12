import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import PayPOSHero from './components/PayPOSHero';

export default function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <PayPOSHero />
      </main>
    </>
  );
}
