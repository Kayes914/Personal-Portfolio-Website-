'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { pageview, GA_MEASUREMENT_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Log the measurement ID during component initialization
  useEffect(() => {
    console.log('GoogleAnalytics component: Using measurement ID:', GA_MEASUREMENT_ID);
    
    // Manually insert the script tag if needed
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && !document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
      console.log('Manually inserting GA script tag');
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    // Track page view when route changes
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const url = pathname + searchParams.toString();
      pageview(url);
    }
  }, [pathname, searchParams]);

  // Don't render anything if measurement ID is not defined
  if (!GA_MEASUREMENT_ID) {
    console.warn('GoogleAnalytics component: No measurement ID found');
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          console.log('Google Analytics script loaded successfully');
        }}
        onError={(e) => {
          console.error('Failed to load Google Analytics script:', e);
        }}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
            console.log('GA config script executed');
          `,
        }}
        onLoad={() => {
          console.log('Google Analytics configuration loaded');
        }}
        onError={(e) => {
          console.error('Failed to load Google Analytics configuration:', e);
        }}
      />
    </>
  );
} 