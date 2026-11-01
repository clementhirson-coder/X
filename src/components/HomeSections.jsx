import { useRef } from 'react';
import { PRODUCTS, ProductIcon } from './PayPOSHero';
import { useSectionMotion, spotlight } from '../lib/motion';
import { CONTACT_EMAIL } from '../config';
import './home-sections.css';

/*
 * Copy rule: every claim below comes from the pricing page (PricingPage.jsx).
 * Lines marked "À VALIDER" are reasonable readings of a module name, not sourced facts.
 */
const MODULE_COPY = {
  paybylink: 'Envoyez un lien de paiement par email ou SMS, encaissé sur le même compte que le terminal.',
  bnpl:      'Paiement en 3x ou 4x proposé directement au client, au moment de l’achat.',
  wero:      'Virement instantané européen : le client paie depuis son compte, sans carte.',
  noshow:    'Protégez vos rendez-vous et réservations contre les absences.', // À VALIDER
  crypto:    'Le client paie en crypto, vous êtes réglé en euros (crypto-fiat).',
  a2a:       'PayPal, WeChat Pay, AliPay et paiements de compte à compte.',
};

function Modules() {
  const ref = useRef(null);
  useSectionMotion(ref);
  return (
    <section id="produits" ref={ref} className="hs-section">
      <header className="hs-head">
        <span className="hs-eyebrow" data-reveal>Les modules</span>
        <h2 className="hs-h2" data-reveal>
          Six façons d’encaisser.<br /><span className="hs-dim">Un seul appareil.</span>
        </h2>
        <div className="hs-rule" data-line />
      </header>

      <div className="hs-grid">
        {PRODUCTS.map(p => (
          <article
            key={p.id}
            className="hs-card"
            data-reveal="scale"
            data-cursor="hover"
            onPointerMove={spotlight}
            style={{ '--accent': p.color }}
          >
            <div className="hs-card-icon"><ProductIcon id={p.id} size={26} /></div>
            <h3 className="hs-card-title">{p.label}</h3>
            <p className="hs-card-text">{MODULE_COPY[p.id]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const FACTS = [
  { count: 1,    decimals: 2, prefix: '€', label: 'par appareil et par mois', note: 'Sans engagement.' },
  { count: 9.9,  decimals: 2, prefix: '€', label: 'd’inscription, une seule fois', note: 'Frais de vérification KYB.' },
  { count: 0.4,  decimals: 2, suffix: '%', label: 'sur le virement instantané', note: '+ €0,50 fixe par transaction.' },
];

const FEATURES = [
  { title: 'QR code illimité',        text: 'Inclus dans l’abonnement, sans plafond.' },
  { title: '50 emails · 10 SMS / mois', text: 'Inclus pour vos reçus et liens de paiement.' },
  { title: 'Rapport quotidien',       text: 'Le récapitulatif de vos encaissements, chaque jour.' },
  { title: 'Marque blanche',          text: 'Offre CORPORATE hébergeable sur votre infrastructure.' },
];

function Features() {
  const ref = useRef(null);
  useSectionMotion(ref);
  return (
    <section id="fonctionnalites" ref={ref} className="hs-section">
      <header className="hs-head">
        <span className="hs-eyebrow" data-reveal>Fonctionnalités &amp; tarifs</span>
        <h2 className="hs-h2" data-reveal>
          Des prix lisibles.<br /><span className="hs-dim">Rien de caché.</span>
        </h2>
        <div className="hs-rule" data-line />
      </header>

      <div className="hs-facts">
        {FACTS.map(f => (
          <div key={f.label} className="hs-fact" data-reveal>
            <span
              className="hs-fact-num"
              data-count={f.count}
              data-decimals={f.decimals}
              data-prefix={f.prefix || ''}
              data-suffix={f.suffix || ''}
            >
              {(f.prefix || '') + f.count.toFixed(f.decimals).replace('.', ',') + (f.suffix || '')}
            </span>
            <span className="hs-fact-label">{f.label}</span>
            <span className="hs-fact-note">{f.note}</span>
          </div>
        ))}
      </div>

      <ul className="hs-features">
        {FEATURES.map(f => (
          <li key={f.title} className="hs-feature" data-reveal>
            <span className="hs-check" aria-hidden>✓</span>
            <div>
              <strong>{f.title}</strong>
              <p>{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="hs-center" data-reveal>
        <a href="#/tarifs" className="hs-btn hs-btn--ghost" data-cursor="hover">Voir la grille complète →</a>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  useSectionMotion(ref);
  const href = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demande de démo PayPOS')}`
    : undefined;
  return (
    <section id="contact" ref={ref} className="hs-section hs-contact">
      <div className="hs-contact-glow" aria-hidden />
      <h2 className="hs-h2 hs-center-text" data-reveal>Prêt à tout encaisser&nbsp;?</h2>
      <p className="hs-lead" data-reveal>
        Inscription à €9,90, puis €1 par mois et par appareil. Sans engagement.
      </p>
      <div className="hs-cta-row" data-reveal>
        {href
          ? <a href={href} className="hs-btn" data-cursor="hover">Demander une démo</a>
          : <span className="hs-btn hs-btn--todo">Demander une démo · adresse de contact à configurer</span>}
        <a href="#/tarifs" className="hs-btn hs-btn--ghost" data-cursor="hover">Voir les tarifs</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hs-footer">
      <span className="hs-logo">PAYPOS<span className="hs-logo-dot" /></span>
      <span>© {new Date().getFullYear()} PayPOS</span>
    </footer>
  );
}

export default function HomeSections() {
  return (
    <>
      <Modules />
      <Features />
      <Contact />
      <Footer />
    </>
  );
}
