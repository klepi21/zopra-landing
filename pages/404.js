import Head from 'next/head';

export default function NotFound() {
  return (
    <div style={styles.page}>
      <Head>
        <title>Η σελίδα δεν βρέθηκε | ZOPRA</title>
        <meta name="robots" content="noindex" />
      </Head>
      <span style={styles.logo}>⚡ ZOPRA</span>
      <h1 style={styles.code}>404</h1>
      <p style={styles.text}>Η σελίδα που ψάχνεις δεν υπάρχει.</p>
      <a href="/" style={styles.btn}>Πίσω στην αρχική</a>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#060810',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 32,
  },
  code: {
    fontSize: 80,
    fontWeight: 900,
    color: '#00C2A8',
    marginBottom: 8,
  },
  text: {
    color: '#A0AEC0',
    fontSize: 16,
    marginBottom: 28,
  },
  btn: {
    background: '#FF4D4D',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: 15,
    padding: '14px 28px',
    borderRadius: 14,
    textDecoration: 'none',
  },
};
