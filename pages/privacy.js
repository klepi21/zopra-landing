import Head from 'next/head';

export default function Privacy() {
  return (
    <div style={styles.page}>
      <Head>
        <title>Πολιτική Απορρήτου | ZOPRA</title>
        <meta name="description" content="Πολιτική απορρήτου της εφαρμογής ZOPRA — πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας." />
        <link rel="canonical" href="https://zopra.app/privacy" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div style={styles.content}>
        <h1 style={styles.title}>⚡ ZOPRA — Privacy Policy</h1>
        <p style={styles.updated}>Last updated: 2026</p>

        <p style={styles.p}>
          ZOPRA (&quot;we&quot;, &quot;the app&quot;) respects your privacy and is committed to
          protecting your personal data. This Privacy Policy describes how we collect, use,
          and protect your information.
        </p>

        <h2 style={styles.h2}>1. Information We Collect</h2>
        <ul style={styles.ul}>
          <li><b>Account data:</b> username and avatar you choose inside the app — required for multiplayer gameplay.</li>
          <li><b>Gameplay data:</b> scores, game statistics, and the words you submit during matches.</li>
          <li>
            <b>Advertising (Google AdMob):</b> the app uses Google AdMob to display ads. Google may collect
            and use device identifiers and location data to provide personalized or non-personalized ads,
            per Google&apos;s own{' '}
            <a style={styles.link} href="https://policies.google.com/privacy">privacy policy</a>.
          </li>
        </ul>

        <h2 style={styles.h2}>2. How We Use Information</h2>
        <p style={styles.p}>We use the data we collect exclusively to:</p>
        <ul style={styles.ul}>
          <li>Provide and maintain the service (e.g. room creation, global leaderboard).</li>
          <li>Prevent abuse and violations of game rules.</li>
        </ul>

        <h2 style={styles.h2}>3. Sharing Data with Third Parties</h2>
        <p style={styles.p}>
          We do not sell or rent your personal data to third parties. Data may be shared with third-party
          service providers (such as Google for advertising, or Clerk/Supabase for authentication and
          storage), only to the extent necessary for the app to function.
        </p>

        <h2 style={styles.h2}>4. Security</h2>
        <p style={styles.p}>
          We take reasonable technical measures to protect your data from unauthorized access, loss, or alteration.
        </p>

        <h2 style={styles.h2}>5. Contact</h2>
        <p style={styles.p}>
          If you have questions or concerns about this Privacy Policy, please contact us at{' '}
          <a style={styles.link} href="mailto:support@zopra.app">support@zopra.app</a>.
        </p>

        <hr style={styles.hr} />

        <h1 style={styles.title}>Πολιτική Απορρήτου</h1>
        <p style={styles.updated}>Τελευταία ενημέρωση: 2026</p>

        <p style={styles.p}>
          Η εφαρμογή <b>ZOPRA</b> (εφεξής &quot;εμείς&quot;, &quot;η εφαρμογή&quot;) σέβεται το απόρρητό σας και
          δεσμεύεται να προστατεύει τα προσωπικά σας δεδομένα. Η παρούσα Πολιτική Απορρήτου περιγράφει τον
          τρόπο με τον οποίο συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τις πληροφορίες σας.
        </p>

        <h2 style={styles.h2}>1. Συλλογή Πληροφοριών</h2>
        <ul style={styles.ul}>
          <li><b>Δεδομένα Λογαριασμού:</b> το όνομα χρήστη και το avatar που επιλέγετε — απαραίτητα για το multiplayer.</li>
          <li><b>Δεδομένα Παιχνιδιού:</b> σκορ, στατιστικά και οι λέξεις που εισάγετε κατά τη διάρκεια των αγώνων.</li>
          <li>
            <b>Διαφημίσεις (Google AdMob):</b> ενδέχεται να συλλέγει αναγνωριστικά συσκευών και δεδομένα
            τοποθεσίας, σύμφωνα με την{' '}
            <a style={styles.link} href="https://policies.google.com/privacy">πολιτική απορρήτου</a> της Google.
          </li>
        </ul>

        <h2 style={styles.h2}>2. Χρήση Πληροφοριών</h2>
        <ul style={styles.ul}>
          <li>Παροχή και συντήρηση της υπηρεσίας (δωμάτια, παγκόσμια κατάταξη).</li>
          <li>Αποτροπή κακόβουλης χρήσης και παραβίασης κανόνων.</li>
        </ul>

        <h2 style={styles.h2}>3. Κοινοποίηση σε Τρίτους</h2>
        <p style={styles.p}>
          Δεν πωλούμε ή ενοικιάζουμε τα δεδομένα σας. Ενδέχεται να κοινοποιηθούν σε τρίτους παρόχους
          (Google, Clerk, Supabase) μόνο στον βαθμό που απαιτείται για τη λειτουργία της εφαρμογής.
        </p>

        <h2 style={styles.h2}>4. Ασφάλεια</h2>
        <p style={styles.p}>Λαμβάνουμε εύλογα τεχνικά μέτρα προστασίας από μη εξουσιοδοτημένη πρόσβαση, απώλεια ή αλλοίωση.</p>

        <h2 style={styles.h2}>5. Επικοινωνία</h2>
        <p style={styles.p}>
          Για ερωτήσεις σχετικά με την Πολιτική Απορρήτου, επικοινωνήστε στο{' '}
          <a style={styles.link} href="mailto:support@zopra.app">support@zopra.app</a>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0B0E17',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '48px 24px',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    maxWidth: 680,
    width: '100%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 4,
  },
  updated: {
    color: '#55627E',
    fontSize: 13,
    marginBottom: 24,
  },
  h2: {
    color: '#00C2A8',
    fontSize: 18,
    fontWeight: 800,
    marginTop: 28,
    marginBottom: 10,
  },
  p: {
    color: '#A0AEC0',
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  ul: {
    color: '#A0AEC0',
    fontSize: 15,
    lineHeight: 1.7,
    paddingLeft: 20,
    marginBottom: 12,
  },
  link: {
    color: '#00C2A8',
    textDecoration: 'underline',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #1E233C',
    margin: '40px 0',
  },
};
