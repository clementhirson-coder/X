import { useEffect, useState } from 'react';
import Navbar from './Navbar';

const transactionData = [
  { method: 'CB & cartes domestiques', emoji: '💳', fixed: 0.25, commission: 2.0 },
  { method: 'Visa / Mastercard', emoji: '💳', fixed: 0.25, commission: 2.5 },
  { method: 'American Express / JCB / CUP / Diners ...', emoji: '💳', fixed: 0.4, commission: 3.5 },
  { method: 'BNPL (3x, 4x)', emoji: '📅', fixed: 0.5, commission: 4.5 },
  { method: 'Virement instantané (Europe)', emoji: '🏦', fixed: 0.5, commission: 0.4 },
  { method: 'Wallets (Paypal, WeChat, AliPay, ...)', emoji: '👛', fixed: 0.5, commission: 3.9 },
  { method: 'Crypto-fiat (euro)', emoji: '₿', fixed: 0.5, commission: 3.4 },
  { method: 'Payweak Reverse', emoji: '🔄', fixed: 0.1, commission: 0.5 },
  { method: 'Payout', emoji: '💸', fixed: 0.5, commission: null },
  { method: 'Rapport quotidien', emoji: '📊', fixed: null, commission: true },
];

export default function PricingPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const t = requestAnimationFrame(() => setVisible(true));
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      cancelAnimationFrame(t);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes pp-fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .pp-pricing-root { animation: pp-fadein 0.4s ease forwards; }
        @media (max-width: 767px) {
          .pp-card { padding: 32px !important; }
          .pp-price { font-size: 40px !important; }
          .pp-cta-wrapper { flex-direction: column !important; align-items: stretch !important; }
          .pp-cta-btn { width: 100% !important; text-align: center !important; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .pp-card { padding: 40px !important; }
        }
      `}</style>
      <Navbar activePage="tarifs" />
      <main
        className="pp-pricing-root"
        style={{ paddingTop: 80, backgroundColor: '#0a0a15', minHeight: '100vh', color: '#fff', opacity: visible ? 1 : 0 }}
      >
        <div style={styles.container}>
          <section style={styles.header}>
            <h1 style={styles.headline}>Tarification PayPOS</h1>
            <p style={styles.subheadline}>
              Abonnement flexible et transparent pour gérer vos paiements
            </p>
          </section>

          <section style={styles.cardWrapper}>
            <div className="pp-card" style={styles.card}>
              <div style={styles.cardSection}>
                <div style={styles.label}>Frais d'inscription</div>
                <div className="pp-price" style={styles.price}>€9,90</div>
                <div style={styles.description}>Payé une seule fois</div>
                <div style={styles.explanation}>
                  Ils correspondent aux frais de KYB (Know Your Business) obligatoires pour valider votre compte professionnel et assurer la conformité aux normes de sécurité.
                </div>
              </div>

              <div style={styles.separator} />

              <div style={styles.cardSection}>
                <div style={styles.label}>Abonnement par appareil</div>
                <div className="pp-price" style={styles.price}>€1,00</div>
                <div style={styles.tagline}>Sans engagement !</div>
                <div style={styles.featuresLabel}>/mois</div>

                <div style={styles.features}>
                  {['50 Emails inclus / mois', '10 SMS inclus / mois', 'QRcode illimité'].map((feature, i) => (
                    <div key={i} style={styles.feature}>
                      <span style={styles.checkmark}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.footnote}>
                  (*) Consommables inclus. Au-delà des limites, tarification à la consommation appliquée.
                </div>
              </div>
            </div>
          </section>

          <section className="pp-cta-wrapper" style={styles.ctaWrapper}>
            <button className="pp-cta-btn" style={styles.buttonPrimary} onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)';
              e.target.style.transform = 'scale(1.02)';
            }} onMouseLeave={(e) => {
              e.target.style.boxShadow = 'none';
              e.target.style.transform = 'scale(1)';
            }}>
              Commencer maintenant
            </button>
            <button className="pp-cta-btn" style={styles.buttonSecondary} onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0,212,255,0.08)';
              e.target.style.borderColor = '#00d4ff';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(0,212,255,0.4)';
            }}>
              Demander une démo
            </button>
          </section>

          <div style={styles.note}>
            Possibilité d'héberger l'abonnement CORPORATE en marque blanche sur votre infrastructure.
          </div>

          <section style={styles.tableSection}>
            <h2 style={styles.tableHeadline}>Tarification par type de transaction</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableHeaderCell}>Type de transaction</th>
                    <th style={styles.tableHeaderCell}>Frais fixes (€)</th>
                    <th style={styles.tableHeaderCell}>Commission (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((row, idx) => (
                    <tr key={idx} style={{
                      ...styles.tableRow,
                      backgroundColor: idx % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent'
                    }}>
                      <td style={styles.tableCell}>
                        <span style={styles.emoji}>{row.emoji}</span> {row.method}
                      </td>
                      <td style={styles.tableCell}>
                        {row.fixed !== null ? `€${row.fixed.toFixed(2)}` : '—'}
                      </td>
                      <td style={styles.tableCell}>
                        {row.commission === true ? '✓' : row.commission !== null ? `${row.commission.toFixed(2)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.corporateSection}>
            <h2 style={styles.corporateHeadline}>Plan CORPORATE</h2>
            <p style={styles.corporateDescription}>
              Tarification personnalisée pour les entreprises avec des volumes élevés ou des besoins spécifiques.
            </p>
            <button style={styles.corporateButton} onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0,212,255,0.08)';
              e.target.style.borderColor = '#00d4ff';
            }} onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(0,212,255,0.3)';
            }}>
              Nous contacter
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' },
  header: { textAlign: 'center', marginBottom: '48px' },
  headline: { fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, margin: 0, marginBottom: '12px', color: '#fff' },
  subheadline: { fontFamily: 'Manrope, sans-serif', fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', margin: 0 },
  cardWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '40px' },
  card: { width: '100%', maxWidth: '600px', padding: '48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '32px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' },
  cardSection: { padding: '24px 0' },
  label: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 600, color: '#00d4ff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  price: { fontFamily: 'Manrope, sans-serif', fontSize: '56px', fontWeight: 800, color: '#fff', margin: '12px 0' },
  description: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginBottom: '12px' },
  explanation: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', maxWidth: '500px', lineHeight: '1.8' },
  separator: { height: '1px', background: 'rgba(0,212,255,0.1)', margin: '24px 0' },
  tagline: { fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 500, color: '#00d4ff', marginTop: '8px' },
  featuresLabel: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginBottom: '20px' },
  features: { margin: '24px 0' },
  feature: { display: 'flex', alignItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '15px', fontWeight: 500, color: '#fff', margin: '14px 0' },
  checkmark: { color: '#00d4ff', fontSize: '20px', marginRight: '12px', fontWeight: 'bold' },
  footnote: { fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: '24px', lineHeight: '1.6' },
  ctaWrapper: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' },
  buttonPrimary: { padding: '16px 40px', fontSize: '15px', fontWeight: 700, fontFamily: 'Manrope, sans-serif', backgroundColor: '#00d4ff', color: '#000', border: 'none', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease' },
  buttonSecondary: { padding: '16px 40px', fontSize: '15px', fontWeight: 600, fontFamily: 'Manrope, sans-serif', backgroundColor: 'transparent', color: '#00d4ff', border: '1.5px solid rgba(0,212,255,0.4)', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease' },
  note: { textAlign: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginBottom: '120px' },
  tableSection: { marginBottom: '120px' },
  tableHeadline: { fontFamily: 'Manrope, sans-serif', fontSize: '24px', fontWeight: 600, color: '#fff', margin: '0 0 32px 0' },
  tableWrapper: { overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(0,212,255,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: 'rgba(0,212,255,0.06)' },
  tableHeaderCell: { fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  tableRow: { height: '44px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  tableCell: { fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 400, color: '#fff', padding: '0 20px', height: '44px', display: 'table-cell', verticalAlign: 'middle' },
  emoji: { marginRight: '8px' },
  corporateSection: { textAlign: 'center', paddingBottom: '80px' },
  corporateHeadline: { fontFamily: 'Manrope, sans-serif', fontSize: '20px', fontWeight: 600, color: '#fff', margin: '0 0 16px 0' },
  corporateDescription: { fontFamily: 'Manrope, sans-serif', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', margin: '0 0 20px 0' },
  corporateButton: { padding: '12px 32px', fontSize: '14px', fontWeight: 600, fontFamily: 'Manrope, sans-serif', backgroundColor: 'transparent', color: '#00d4ff', border: '1.5px solid rgba(0,212,255,0.3)', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease' },
};