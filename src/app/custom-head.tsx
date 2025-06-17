'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function CustomHead() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  useEffect(() => {
    console.log('Google Analytics Measurement ID:', GA_MEASUREMENT_ID || 'MISSING');
  }, [GA_MEASUREMENT_ID]);
  
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
            console.log('Google Analytics initialized');
          `,
        }}
      />
    </>
  );
} 