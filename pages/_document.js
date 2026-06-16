import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="el">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#060810" />
        <meta
          name="description"
          content="ZOPRA — Το ελληνικό παιχνίδι λέξεων Όνομα, Ζώο, Πράγμα. Παίξε online με φίλους σε πραγματικό χρόνο, δωρεάν στο iOS."
        />
        <meta property="og:title" content="ZOPRA — Το παιχνίδι λέξεων που μεγαλώσαμε όλοι" />
        <meta
          property="og:description"
          content="Όνομα, Ζώο, Πράγμα — online, με φίλους, σε πραγματικό χρόνο. Δωρεάν στο iOS."
        />
        <meta property="og:type" content="website" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
