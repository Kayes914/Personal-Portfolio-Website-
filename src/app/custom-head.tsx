'use client';

import Script from 'next/script';

export default function CustomHead() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-01XWVE5YTT';

  return (
    <>
      {/* Google Analytics - Using async loading to avoid errors */}
      <Script
        id="ga-tag-manager"
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { page_path: window.location.pathname });
          `
        }}
      />
    </>
  );
} 