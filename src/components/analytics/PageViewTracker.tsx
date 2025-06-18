'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/utils/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-01XWVE5YTT';

  useEffect(() => {
    // Don't track views for dashboard routes
    if (!pathname.startsWith('/dashboard')) {
      // Track in Supabase
      trackPageView(pathname);
      
      // Track in Google Analytics if gtag is available
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        const url = pathname + searchParams.toString();
        window.gtag('config', gaId, {
          page_path: url,
        });
        console.log('Page view tracked in GA:', url);
      }
    }
  }, [pathname, searchParams, gaId]);

  return null;
} 