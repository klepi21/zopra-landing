import Head from 'next/head';
import styles from '../styles/Home.module.css';

const APP_STORE_URL = 'https://apps.apple.com/us/app/zopra-%CF%8C%CE%BD%CE%BF%CE%BC%CE%B1-%CE%B6%CF%8E%CE%BF-%CF%80%CF%81%CE%AC%CE%B3%CE%BC%CE%B1/id6771102888';

const FEATURES = [
  { icon: '⚡', title: 'Real-time Multiplayer', desc: 'Παίξε live με φίλους, χωρίς καθυστερήσεις, σε πραγματικό χρόνο.' },
  { icon: '👥', title: 'Έως 8 Παίκτες', desc: 'Δημιούργησε δωμάτιο και κάλεσε μέχρι 8 άτομα ταυτόχρονα.' },
  { icon: '🌐', title: 'Δημόσια Παιχνίδια', desc: 'Μπες σε ανοιχτά δωμάτια και γνώρισε νέους παίκτες ανά τη χώρα.' },
  { icon: '🏆', title: 'Παγκόσμια Κατάταξη', desc: 'Σύγκρινε το σκορ σου με όλους τους παίκτες του ZOPRA.' },
  { icon: '⭐', title: 'Σύστημα Επιπέδων', desc: 'Ανέβα από Αρχάριος μέχρι Αθάνατος όσο μαζεύεις πόντους.' },
  { icon: '🔔', title: 'Ειδοποιήσεις', desc: 'Μάθε αμέσως μόλις ανοίξει νέο δημόσιο παιχνίδι.' },
];

const FAQS = [
  { q: 'Είναι δωρεάν το ZOPRA;', a: 'Ναι, το ZOPRA είναι 100% δωρεάν στο κατέβασμα και στην χρήση του.' },
  { q: 'Πόσοι παίκτες μπορούν να παίξουν μαζί;', a: 'Μέχρι 8 παίκτες σε ένα δωμάτιο, ιδιωτικό ή δημόσιο.' },
  { q: 'Χρειάζεται λογαριασμός;', a: 'Χρειάζεται μόνο ένα όνομα χρήστη — η εγγραφή παίρνει λιγότερο από ένα λεπτό.' },
  { q: 'Υπάρχει έκδοση για Android;', a: 'Σύντομα! Αυτή τη στιγμή το ZOPRA είναι διαθέσιμο μόνο για iOS.' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Head>
        <title>ZOPRA — Το ελληνικό παιχνίδι λέξεων</title>
      </Head>

      <div className={`${styles.blob} ${styles.blobTeal}`} />
      <div className={`${styles.blob} ${styles.blobRed}`} />
      <div className={`${styles.blob} ${styles.blobPurple}`} />

      {/* NAV */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>⚡ ZOPRA</span>
        <a href={APP_STORE_URL} className={styles.navCta}>Κατέβασέ το</a>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.badge}>🇬🇷 Το πιο διασκεδαστικό ελληνικό multiplayer</div>
          <h1 className={styles.heroTitle}>
            Το παιχνίδι λέξεων<br />που έπαιζες ως παιδί.<br />
            <span className={styles.heroTitleAccent}>Τώρα στο κινητό σου.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Όνομα, Ζώο, Πράγμα — online, με φίλους, σε πραγματικό χρόνο.
            Ένα γράμμα, έξι κατηγορίες, 12 δευτερόλεπτα. Δωρεάν.
          </p>
          <a href={APP_STORE_URL} className={styles.ctaBtn}>
            <AppleLogo /> Κατέβασέ το Δωρεάν
          </a>
          <p className={styles.heroNote}>Διαθέσιμο για iOS · Χωρίς συνδρομή</p>
        </div>
        <div className={styles.heroImageWrap}>
          <img src="/screenshots/screen1.png" alt="ZOPRA app intro" className={styles.phoneGlow} />
        </div>
      </section>

      {/* STATS / TRUST BAR */}
      <div className={styles.statsBar}>
        <div className={styles.statChip}>🆓 100% Δωρεάν</div>
        <div className={styles.statChip}>⚡ Real-time</div>
        <div className={styles.statChip}>👥 Έως 8 Παίκτες</div>
        <div className={styles.statChip}>🏆 Παγκόσμια Κατάταξη</div>
      </div>

      {/* HOW IT WORKS */}
      <section className={styles.sectionReverse}>
        <div className={styles.sectionImageWrap}>
          <img src="/screenshots/screen2.png" alt="Πώς παίζεται το ZOPRA" className={styles.sectionImage} />
        </div>
        <div className={styles.sectionText}>
          <span className={styles.eyebrow}>ΠΩΣ ΠΑΙΖΕΤΑΙ</span>
          <h2 className={styles.sectionTitle}>Ένα γράμμα. Έξι κατηγορίες. 12 δευτερόλεπτα.</h2>
          <ul className={styles.checklist}>
            <li>⚡ <b>Αυτόματη επιλογή</b> — το γράμμα επιλέγεται τυχαία σε κάθε γύρο</li>
            <li>⏱️ <b>12 δευτερόλεπτα ανά κατηγορία</b> — σκέψου γρήγορα ή χάσε τον γύρο</li>
            <li>🏅 <b>Μοναδική απάντηση = 20 πόντοι</b> — όσο πιο πρωτότυπος, τόσο πιο ψηλά</li>
          </ul>
        </div>
      </section>

      {/* PLAY WITH FRIENDS */}
      <section className={styles.section}>
        <div className={styles.sectionText}>
          <span className={styles.eyebrow}>ΠΑΙΞΕ ΜΕ ΤΗΝ ΠΑΡΕΑ ΣΟΥ</span>
          <h2 className={styles.sectionTitle}>Γράψε γρήγορα — ο χρόνος δεν περιμένει!</h2>
          <p className={styles.sectionParagraph}>
            Δημιούργησε δωμάτιο, μοιράσου τον κωδικό με μια κίνηση, και παίξτε μέχρι 8 άτομα
            ταυτόχρονα. Ή μπες σε ένα από τα δημόσια παιχνίδια και γνώρισε νέους παίκτες.
          </p>
          <a href={APP_STORE_URL} className={styles.inlineCta}>Δοκίμασέ το τώρα →</a>
        </div>
        <div className={styles.sectionImageWrap}>
          <img src="/screenshots/screen3.png" alt="ZOPRA αρχική οθόνη" className={styles.sectionImage} />
        </div>
      </section>

      {/* LOBBY */}
      <section className={styles.sectionReverse}>
        <div className={styles.sectionImageWrap}>
          <img src="/screenshots/screen4.png" alt="ZOPRA lobby με φίλους" className={styles.sectionImage} />
        </div>
        <div className={styles.sectionText}>
          <span className={styles.eyebrow}>ΛΟΜΠΙ ΠΑΙΧΝΙΔΙΟΥ</span>
          <h2 className={styles.sectionTitle}>Μοναδική απάντηση = 20 πόντοι. Ήσουν ο μόνος;</h2>
          <p className={styles.sectionParagraph}>
            Μέχρι 8 παίκτες σε ένα δωμάτιο, real-time ενημερώσεις, και ένα κλικ για να μοιραστείς
            τον κωδικό σε WhatsApp ή Instagram. Όλοι έτοιμοι, ένα κουμπί, ξεκινάμε.
          </p>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className={styles.section}>
        <div className={styles.sectionText}>
          <span className={styles.eyebrow}>ΠΑΓΚΟΣΜΙΑ ΚΑΤΑΤΑΞΗ</span>
          <h2 className={styles.sectionTitle}>Ποιος είναι ο καλύτερος στην παρέα;</h2>
          <p className={styles.sectionParagraph}>
            Κάθε παιχνίδι μετράει. Ανέβα στην παγκόσμια κατάταξη, χτίσε το προφίλ σου, και
            απόδειξε ποιος ξέρει περισσότερες λέξεις από όλους.
          </p>
          <a href={APP_STORE_URL} className={styles.inlineCta}>Μπες στην κατάταξη →</a>
        </div>
        <div className={styles.sectionImageWrap}>
          <img src="/screenshots/screen5.png" alt="ZOPRA παγκόσμια κατάταξη" className={styles.sectionImage} />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <span className={styles.eyebrow}>ΟΛΑ ΤΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ</span>
          <h2 className={styles.sectionTitle}>Όλα όσα χρειάζεσαι για βραδιές με την παρέα</h2>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Συχνές Ερωτήσεις</h2>
        {FAQS.map((item) => (
          <details key={item.q} className={styles.faqItem}>
            <summary>{item.q}</summary>
            <div className={styles.faqAnswer}>{item.a}</div>
          </details>
        ))}
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Έτοιμος να παίξεις;</h2>
        <p className={styles.finalCtaSubtitle}>
          Κατέβασέ το δωρεάν και ξεκίνα τον πρώτο σου γύρο σε λιγότερο από ένα λεπτό.
        </p>
        <a href={APP_STORE_URL} className={styles.ctaBtn}>
          <AppleLogo /> Κατέβασέ το Δωρεάν
        </a>
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

function AppleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.014-.07-.034-.22-.034-.37 0-1.13.555-2.27 1.187-2.98.744-.85 2.05-1.5 3.06-1.54.014.1.03.24.03.27zm4.49 16.66c-.03.07-.45 1.55-1.49 3.06-.97 1.4-1.97 2.79-3.53 2.82-1.51.03-2-.88-3.73-.88-1.73 0-2.27.85-3.7.91-1.49.05-2.62-1.5-3.6-2.9-2-2.86-3.5-8.08-1.47-11.6.99-1.75 2.78-2.86 4.7-2.89 1.47-.03 2.4.95 3.62.95 1.21 0 1.93-.95 3.65-.95.97 0 2.97.09 4.27 2.13-.11.07-2.55 1.49-2.52 4.45.03 3.53 3.1 4.7 3.13 4.71-.02.08-.49 1.7-1.61 3.18z"/>
    </svg>
  );
}
