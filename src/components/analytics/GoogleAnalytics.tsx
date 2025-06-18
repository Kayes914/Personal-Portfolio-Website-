'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { pageview } from '@/lib/analytics';

export default function GoogleAnalytics({ 
  GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
}: { 
  GA_MEASUREMENT_ID?: string 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Use the measurement ID from props or environment variable
  const measurementId = GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) {
      console.warn('Google Analytics Measurement ID is not defined');
      return;
    }

    // Clear any potentially cached GA data
    if (typeof window !== 'undefined') {
      // Remove any cached GA cookies
      document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Clear any existing dataLayer
      window.dataLayer = [];
      
      console.log('Google Analytics setup with ID:', measurementId);
    }
    
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams, measurementId]);

  // Don't render anything if measurement ID is not defined
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'max-age=7200;secure;samesite=none'
            });
          `,
        }}
      />
    </>
  );
} 