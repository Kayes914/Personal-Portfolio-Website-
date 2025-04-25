'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/utils/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track views for dashboard routes
    if (!pathname.startsWith('/dashboard')) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
} 