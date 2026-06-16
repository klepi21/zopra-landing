import Head from 'next/head';
import { useRef } from 'react';
import styles from '../styles/Home.module.css';

const APP_STORE_URL = 'https://apps.apple.com/us/app/zopra-%CF%8C%CE%BD%CE%BF%CE%BC%CE%B1-%CE%B6%CF%8E%CE%BF-%CF%80%CF%81%CE%AC%CE%B3%CE%BC%CE%B1/id6771102888';
const SITE_URL = 'https://zopra.app';
const TITLE = 'ZOPRA — Όνομα Ζώο Πράγμα Online | Παιχνίδι Λέξεων με Φίλους';
const DESCRIPTION =
  'ZOPRA: το κλασικό Όνομα Ζώο Πράγμα σε νέα ψηφιακή μορφή. Παίξε online με φίλους σε πραγματικό χρόνο, δημιούργησε δωμάτιο με κωδικό, ανέβα στην παγκόσμια κατάταξη. Δωρεάν για iOS.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'ZOPRA - Όνομα Ζώο Πράγμα',
  operatingSystem: 'iOS',
  applicationCategory: 'GameApplication',
  description: DESCRIPTION,
  url: SITE_URL,
  image: OG_IMAGE,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  publisher: { '@type': 'Organization', name: 'ZOPRA', url: SITE_URL },
};

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Είναι δωρεάν το ZOPRA;',
      acceptedAnswer: { '@type': 'Answer', text: 'Ναι, το ZOPRA είναι 100% δωρεάν στο κατέβασμα και στην χρήση του.' },
    },
    {
      '@type': 'Question',
      name: 'Πόσοι παίκτες μπορούν να παίξουν μαζί;',
      acceptedAnswer: { '@type': 'Answer', text: 'Μέχρι 8 παίκτες σε ένα δωμάτιο, ιδιωτικό ή δημόσιο.' },
    },
    {
      '@type': 'Question',
      name: 'Χρειάζεται λογαριασμός;',
      acceptedAnswer: { '@type': 'Answer', text: 'Χρειάζεται μόνο ένα όνομα χρήστη — η εγγραφή παίρνει λιγότερο από ένα λεπτό.' },
    },
    {
      '@type': 'Question',
      name: 'Υπάρχει έκδοση για Android;',
      acceptedAnswer: { '@type': 'Answer', text: 'Σύντομα! Αυτή τη στιγμή το ZOPRA είναι διαθέσιμο μόνο για iOS.' },
    },
  ],
};

const FEATURES = [
  { icon: '⚡', title: 'Real-time Multiplayer', desc: 'Παίξε live με φίλους, χωρίς καθυστερήσεις, σε πραγματικό χρόνο.' },
  { icon: '👥', title: 'Έως 8 Παίκτες', desc: 'Δημιούργησε δωμάτιο και κάλεσε μέχρι 8 άτομα ταυτόχρονα.' },
  { icon: '🌐', title: 'Δημόσια Παιχνίδια', desc: 'Μπες σε ανοιχτά δωμάτια και γνώρισε νέους παίκτες ανά τη χώρα.' },
  { icon: '🏆', title: 'Παγκόσμια Κατάταξη', desc: 'Σύγκρινε το σκορ σου με όλους τους παίκτες του ZOPRA.' },
  { icon: '⭐', title: 'Σύστημα Επιπέδων', desc: 'Ανέβα από Αρχάριος μέχρι Αθάνατος όσο μαζεύεις πόντους.' },
  { icon: '🔔', title: 'Ειδοποιήσεις', desc: 'Μάθε αμέσως μόλις ανοίξει νέο δημόσιο παιχνίδι.' },
];

// Generates an N-pointed star polygon for the decorative bursts
function starPoints(spikes, outerR, innerR, cx, cy) {
  const pts = [];
  const step = Math.PI / spikes;
  let rot = -Math.PI / 2;
  for (let i = 0; i < spikes; i++) {
    pts.push(`${(cx + Math.cos(rot) * outerR).toFixed(1)},${(cy + Math.sin(rot) * outerR).toFixed(1)}`);
    rot += step;
    pts.push(`${(cx + Math.cos(rot) * innerR).toFixed(1)},${(cy + Math.sin(rot) * innerR).toFixed(1)}`);
    rot += step;
  }
  return pts.join(' ');
}
const STAR_PTS = starPoints(9, 50, 20, 50, 50);

function Starburst({ size = 120, color = '#00C2A8', style }) {
  return (
    <svg
      className={styles.starburst}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={style}
    >
      <polygon points={STAR_PTS} fill={color} opacity="0.55" />
    </svg>
  );
}

function DiagonalLines() {
  return (
    <svg className={styles.linesWrap} preserveAspectRatio="none">
      <line x1="0%" y1="20%" x2="40%" y2="0%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="60%" y1="100%" x2="100%" y2="60%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="10%" y1="100%" x2="50%" y2="55%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  const trackRef = useRef(null);

  const scrollCarousel = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="όνομα ζώο πράγμα, όνομα ζώο πράγμα online, παιχνίδι λέξεων, ελληνικό παιχνίδι, παιχνίδι με φίλους online, παιχνίδι παρέας, zopra, παιχνίδι με γράμματα, scattergories ελληνικά, stop παιχνίδι λέξεων, παιχνίδι κινητό δωρεάν, multiplayer word game greek"
        />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="el_GR" />
        <meta property="og:site_name" content="ZOPRA" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
        />
      </Head>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <img src="/zopra-icon.png" alt="ZOPRA" className={styles.navIcon} />
          <span className={styles.navLogo}>ZOPRA</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#about">Σχετικά</a>
          <a href="#features">Χαρακτηριστικά</a>
          <a href="#faq">FAQ</a>
        </div>
        <a href={APP_STORE_URL} className={styles.navCta}>Κατέβασέ το</a>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <DiagonalLines />
        <Starburst size={140} color="#00C2A8" style={{ top: 20, right: 40 }} />

        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Το ελληνικό παιχνίδι λέξεων</span>
          <h1 className={`${styles.heroTitle} ${styles.headlineFont}`}>
            Εύκολος τρόπος<br />να δείξεις<br />
            <span className={styles.heroTitleAccent}>ποιος ξέρει λέξεις</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Όνομα, Ζώο, Πράγμα — online, με φίλους, σε πραγματικό χρόνο.
            Ένα γράμμα, έξι κατηγορίες, 12 δευτερόλεπτα.
          </p>

          <a href={APP_STORE_URL} className={styles.storeBadge}>
            <AppleLogo size={26} />
            <span className={styles.storeBadgeText}>
              <span className={styles.storeBadgeSmall}>Διαθέσιμο στο</span>
              <span className={styles.storeBadgeBig}>App Store</span>
            </span>
          </a>

          <div className={styles.heroProof}>
            <div className={styles.avatarStack}>
              <span className={styles.avatarChip} style={{ background: '#FF4D4D' }}>🦉</span>
              <span className={styles.avatarChip} style={{ background: '#00C2A8' }}>⚡</span>
              <span className={styles.avatarChip} style={{ background: '#7C3AED' }}>🛡️</span>
            </div>
            <span className={styles.proofText}>
              <span className={styles.proofTextBold}>100% Δωρεάν</span><br />Χωρίς συνδρομή
            </span>
          </div>
        </div>

        <div className={styles.heroImageWrap}>
          <div className={`${styles.phoneFrame} ${styles.phoneGlow}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw1.jpg" alt="ZOPRA αρχική οθόνη" />
          </div>
        </div>
      </section>

      {/* ABOUT / TWO PHONE SHOWCASE */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutCard}>
          <Starburst size={90} color="#7C3AED" style={{ top: -20, left: -10 }} />
          <div className={`${styles.phoneFrame} ${styles.aboutPhoneBack}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw3.jpg" alt="ZOPRA σύστημα επιπέδων" />
          </div>
          <div className={`${styles.phoneFrame} ${styles.aboutPhoneFront}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw5.jpg" alt="ZOPRA λόμπι παιχνιδιού" />
          </div>
        </div>
        <div className={styles.aboutText}>
          <span className={styles.eyebrow}>Σχετικά με το παιχνίδι</span>
          <h2 className={`${styles.aboutTitle} ${styles.headlineFont}`}>
            Γράψε γρήγορα, σκέψου πρωτότυπα
          </h2>
          <p className={styles.aboutParagraph}>
            Σε κάθε γύρο, ένα γράμμα επιλέγεται τυχαία και έχεις 12 δευτερόλεπτα να γράψεις
            μια λέξη για κάθε κατηγορία. Όσο πιο μοναδική η απάντησή σου, τόσο περισσότεροι
            πόντοι. Μετά, όλοι ψηφίζουν ποιες απαντήσεις μετράνε.
          </p>
          <a href={APP_STORE_URL} className={styles.pillBtn}>Δοκίμασέ το Δωρεάν</a>
        </div>
      </section>

      {/* FEATURES — light contrast section */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.featuresInner}>
          <Starburst size={100} color="#7C3AED" style={{ top: -10, right: 20 }} />
          <div className={styles.featuresHeaderRow}>
            <div>
              <span className={styles.eyebrow}>Χαρακτηριστικά</span>
              <h2 className={`${styles.featuresTitle} ${styles.headlineFont}`}>
                Όλα όσα χρειάζεσαι για βραδιές με την παρέα
              </h2>
            </div>
            <div className={styles.carouselNav}>
              <button className={styles.navArrow} onClick={() => scrollCarousel(-1)} aria-label="Πίσω">←</button>
              <button className={`${styles.navArrow} ${styles.navArrowDark}`} onClick={() => scrollCarousel(1)} aria-label="Μπροστά">→</button>
            </div>
          </div>

          <div className={styles.carouselTrack} ref={trackRef}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div className={styles.featureCardTitle}>{f.title}</div>
                <div className={styles.featureCardDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <DiagonalLines />
        <h2 className={`${styles.finalCtaTitle} ${styles.headlineFont}`}>
          Ξεκίνα τον πρώτο σου<br />γύρο σε ένα κλικ
        </h2>
        <p className={styles.finalCtaSubtitle}>
          Κατέβασέ το δωρεάν, διάλεξε ένα όνομα χρήστη, και είσαι έτοιμος να παίξεις
          με την παρέα σου σε λιγότερο από ένα λεπτό.
        </p>
        <a href={APP_STORE_URL} className={styles.pillBtn}>Κατέβασέ το Δωρεάν</a>

        <div className={styles.fannedPhones}>
          <Starburst size={70} color="#FFFFFF" style={{ position: 'absolute', left: '18%', top: 0 }} />
          <div className={`${styles.phoneFrame} ${styles.fannedPhone} ${styles.fannedPhoneLeft}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw4.jpg" alt="ZOPRA δημιουργία παιχνιδιού" />
          </div>
          <div className={`${styles.phoneFrame} ${styles.fannedPhone} ${styles.fannedPhoneCenter}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw1.jpg" alt="ZOPRA αρχική οθόνη" />
          </div>
          <div className={`${styles.phoneFrame} ${styles.fannedPhone} ${styles.fannedPhoneRight}`}>
            <span className={styles.phoneFrameNotch} />
            <img src="/screenshots/raw2.jpg" alt="ZOPRA παγκόσμια κατάταξη" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Zopra</span>
        <span className={styles.footerDivider}>·</span>
        <a href="/privacy" className={styles.footerLink}>Privacy</a>
        <span className={styles.footerDivider}>·</span>
        <a href="/terms" className={styles.footerLink}>Terms</a>
      </footer>
    </div>
  );
}

function AppleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.014-.07-.034-.22-.034-.37 0-1.13.555-2.27 1.187-2.98.744-.85 2.05-1.5 3.06-1.54.014.1.03.24.03.27zm4.49 16.66c-.03.07-.45 1.55-1.49 3.06-.97 1.4-1.97 2.79-3.53 2.82-1.51.03-2-.88-3.73-.88-1.73 0-2.27.85-3.7.91-1.49.05-2.62-1.5-3.6-2.9-2-2.86-3.5-8.08-1.47-11.6.99-1.75 2.78-2.86 4.7-2.89 1.47-.03 2.4.95 3.62.95 1.21 0 1.93-.95 3.65-.95.97 0 2.97.09 4.27 2.13-.11.07-2.55 1.49-2.52 4.45.03 3.53 3.1 4.7 3.13 4.71-.02.08-.49 1.7-1.61 3.18z"/>
    </svg>
  );
}
