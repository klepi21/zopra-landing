const APP_STORE_URL = 'https://apps.apple.com/app/id0000000000'; // TODO: replace with real App Store ID once live

export default function Home() {
  return (
    <div style={styles.page}>
      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>⚡ ZOPRA</span>
        <a href={APP_STORE_URL} style={styles.navCta}>Κατέβασέ το</a>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <div style={styles.badge}>🇬🇷 Το πιο διασκεδαστικό ελληνικό multiplayer</div>
          <h1 style={styles.heroTitle}>
            Το παιχνίδι λέξεων<br />που έπαιζες ως παιδί.<br />
            <span style={styles.heroTitleAccent}>Τώρα στο κινητό σου.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Όνομα, Ζώο, Πράγμα — online, με φίλους, σε πραγματικό χρόνο.
            Ένα γράμμα, έξι κατηγορίες, 12 δευτερόλεπτα. Δωρεάν.
          </p>
          <a href={APP_STORE_URL} style={styles.heroCta}>
            <AppleLogo /> Κατέβασέ το Δωρεάν
          </a>
          <p style={styles.heroNote}>Διαθέσιμο για iOS · Χωρίς συνδρομή</p>
        </div>
        <div style={styles.heroImageWrap}>
          <img src="/screenshots/screen1.png" alt="ZOPRA app intro" style={styles.heroImage} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.sectionReverse}>
        <div style={styles.sectionImageWrap}>
          <img src="/screenshots/screen2.png" alt="Πώς παίζεται το ZOPRA" style={styles.sectionImage} />
        </div>
        <div style={styles.sectionText}>
          <span style={styles.eyebrow}>ΠΩΣ ΠΑΙΖΕΤΑΙ</span>
          <h2 style={styles.sectionTitle}>Ένα γράμμα. Έξι κατηγορίες. 12 δευτερόλεπτα.</h2>
          <ul style={styles.checklist}>
            <li>⚡ <b>Αυτόματη επιλογή</b> — το γράμμα επιλέγεται τυχαία σε κάθε γύρο</li>
            <li>⏱️ <b>12 δευτερόλεπτα ανά κατηγορία</b> — σκέψου γρήγορα ή χάσε τον γύρο</li>
            <li>🏅 <b>Μοναδική απάντηση = 20 πόντοι</b> — όσο πιο πρωτότυπος, τόσο πιο ψηλά</li>
          </ul>
        </div>
      </section>

      {/* PLAY WITH FRIENDS */}
      <section style={styles.section}>
        <div style={styles.sectionText}>
          <span style={styles.eyebrow}>ΠΑΙΞΕ ΜΕ ΤΗΝ ΠΑΡΕΑ ΣΟΥ</span>
          <h2 style={styles.sectionTitle}>Γράψε γρήγορα — ο χρόνος δεν περιμένει!</h2>
          <p style={styles.sectionParagraph}>
            Δημιούργησε δωμάτιο, μοιράσου τον κωδικό με μια κίνηση, και παίξτε μέχρι 8 άτομα
            ταυτόχρονα. Ή μπες σε ένα από τα δημόσια παιχνίδια και γνώρισε νέους παίκτες.
          </p>
          <a href={APP_STORE_URL} style={styles.inlineCta}>Δοκίμασέ το τώρα →</a>
        </div>
        <div style={styles.sectionImageWrap}>
          <img src="/screenshots/screen3.png" alt="ZOPRA αρχική οθόνη" style={styles.sectionImage} />
        </div>
      </section>

      {/* LOBBY */}
      <section style={styles.sectionReverse}>
        <div style={styles.sectionImageWrap}>
          <img src="/screenshots/screen4.png" alt="ZOPRA lobby με φίλους" style={styles.sectionImage} />
        </div>
        <div style={styles.sectionText}>
          <span style={styles.eyebrow}>ΛΟΜΠΙ ΠΑΙΧΝΙΔΙΟΥ</span>
          <h2 style={styles.sectionTitle}>Μοναδική απάντηση = 20 πόντοι. Ήσουν ο μόνος;</h2>
          <p style={styles.sectionParagraph}>
            Μέχρι 8 παίκτες σε ένα δωμάτιο, real-time ενημερώσεις, και ένα κλικ για να μοιραστείς
            τον κωδικό σε WhatsApp ή Instagram. Όλοι έτοιμοι, ένα κουμπί, ξεκινάμε.
          </p>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={styles.section}>
        <div style={styles.sectionText}>
          <span style={styles.eyebrow}>ΠΑΓΚΟΣΜΙΑ ΚΑΤΑΤΑΞΗ</span>
          <h2 style={styles.sectionTitle}>Ποιος είναι ο καλύτερος στην παρέα;</h2>
          <p style={styles.sectionParagraph}>
            Κάθε παιχνίδι μετράει. Ανέβα στην παγκόσμια κατάταξη, χτίσε το προφίλ σου, και
            απόδειξε ποιος ξέρει περισσότερες λέξεις από όλους.
          </p>
          <a href={APP_STORE_URL} style={styles.inlineCta}>Μπες στην κατάταξη →</a>
        </div>
        <div style={styles.sectionImageWrap}>
          <img src="/screenshots/screen5.png" alt="ZOPRA παγκόσμια κατάταξη" style={styles.sectionImage} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Έτοιμος να παίξεις;</h2>
        <p style={styles.finalCtaSubtitle}>
          Κατέβασέ το δωρεάν και ξεκίνα τον πρώτο σου γύρο σε λιγότερο από ένα λεπτό.
        </p>
        <a href={APP_STORE_URL} style={styles.heroCta}>
          <AppleLogo /> Κατέβασέ το Δωρεάν
        </a>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span>© {new Date().getFullYear()} Zopra</span>
        <span style={styles.footerDivider}>·</span>
        <a href="/privacy" style={styles.footerLink}>Privacy</a>
        <span style={styles.footerDivider}>·</span>
        <a href="/terms" style={styles.footerLink}>Terms</a>
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

const styles = {
  page: {
    backgroundColor: '#0B0E17',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#FFFFFF',
    overflowX: 'hidden',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    maxWidth: 1100,
    margin: '0 auto',
  },
  navLogo: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 0.5,
  },
  navCta: {
    backgroundColor: '#00C2A8',
    color: '#0B0E17',
    fontWeight: 800,
    fontSize: 13,
    padding: '10px 18px',
    borderRadius: 12,
    textDecoration: 'none',
  },
  hero: {
    display: 'flex',
    flexWrap: 'wrap-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    maxWidth: 1100,
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  heroText: {
    flex: '1 1 420px',
    minWidth: 300,
    maxWidth: 480,
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 194, 168, 0.12)',
    border: '1px solid rgba(0, 194, 168, 0.3)',
    color: '#00C2A8',
    fontSize: 13,
    fontWeight: 700,
    padding: '6px 14px',
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.15,
    marginBottom: 16,
  },
  heroTitleAccent: {
    color: '#00C2A8',
  },
  heroSubtitle: {
    fontSize: 17,
    color: '#A0AEC0',
    lineHeight: 1.6,
    marginBottom: 28,
  },
  heroCta: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#FF4D4D',
    color: '#FFFFFF',
    fontWeight: 900,
    fontSize: 16,
    padding: '16px 28px',
    borderRadius: 16,
    textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(255, 77, 77, 0.35)',
  },
  heroNote: {
    color: '#55627E',
    fontSize: 13,
    marginTop: 14,
  },
  heroImageWrap: {
    flex: '1 1 280px',
    display: 'flex',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 24,
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
  },
  sectionReverse: {
    display: 'flex',
    flexWrap: 'wrap-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    maxWidth: 1100,
    margin: '0 auto',
    padding: '60px 24px',
  },
  sectionText: {
    flex: '1 1 380px',
    minWidth: 280,
    maxWidth: 460,
  },
  eyebrow: {
    color: '#00C2A8',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.25,
    margin: '10px 0 18px',
  },
  sectionParagraph: {
    color: '#A0AEC0',
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 20,
  },
  checklist: {
    listStyle: 'none',
    padding: 0,
    color: '#D1D9E6',
    fontSize: 15,
    lineHeight: 2,
  },
  inlineCta: {
    color: '#00C2A8',
    fontWeight: 800,
    fontSize: 15,
    textDecoration: 'none',
  },
  sectionImageWrap: {
    flex: '1 1 240px',
    display: 'flex',
    justifyContent: 'center',
  },
  sectionImage: {
    width: '100%',
    maxWidth: 260,
    borderRadius: 20,
  },
  finalCta: {
    textAlign: 'center',
    padding: '90px 24px',
    background: 'linear-gradient(180deg, rgba(0,194,168,0.08), transparent)',
  },
  finalCtaTitle: {
    fontSize: 32,
    fontWeight: 900,
    marginBottom: 12,
  },
  finalCtaSubtitle: {
    color: '#A0AEC0',
    fontSize: 16,
    marginBottom: 28,
    maxWidth: 420,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    textAlign: 'center',
    padding: '32px 24px 48px',
    color: '#55627E',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerDivider: {
    color: '#2A3145',
  },
  footerLink: {
    color: '#55627E',
    textDecoration: 'underline',
  },
};
