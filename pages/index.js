export default function Home() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>⚡ ZOPRA</h1>
        <p style={styles.subtitle}>Όνομα, Ζώο, Πράγμα — το αγαπημένο παιχνίδι λέξεων, τώρα στο κινητό σου.</p>
        <p style={styles.tagline}>Παίξε με φίλους, σε πραγματικό χρόνο.</p>
      </div>
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

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0B0E17',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px',
  },
  card: {
    textAlign: 'center',
    maxWidth: 480,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: 1,
    marginBottom: 16,
  },
  subtitle: {
    color: '#A0AEC0',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  tagline: {
    color: '#00C2A8',
    fontSize: 15,
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    color: '#55627E',
    fontSize: 12,
    display: 'flex',
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
