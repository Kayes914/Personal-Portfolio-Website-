'use client';

import { useEffect, useState } from 'react';

export default function DebugGA() {
  const [status, setStatus] = useState<{
    measurementId: string | null;
    scriptLoaded: boolean;
    gtagDefined: boolean;
    dataLayerDefined: boolean;
  }>({
    measurementId: null,
    scriptLoaded: false,
    gtagDefined: false,
    dataLayerDefined: false
  });

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const checkGA = () => {
      const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
      
      // Check if GA script is in the DOM
      const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      
      // Check if gtag function exists
      const gtagDefined = typeof (window as any).gtag === 'function';
      
      // Check if dataLayer exists
      const dataLayerDefined = Array.isArray((window as any).dataLayer);

      setStatus({
        measurementId,
        scriptLoaded: !!gaScript,
        gtagDefined,
        dataLayerDefined
      });

      // Try to manually trigger a page view if everything seems to be loaded
      if (gtagDefined && measurementId) {
        try {
          (window as any).gtag('config', measurementId, {
            page_path: window.location.pathname,
            debug_mode: true
          });
          console.log('Manually triggered GA pageview');
        } catch (err) {
          console.error('Failed to trigger manual pageview:', err);
        }
      }
    };

    // Check immediately and then again after a delay to allow scripts to load
    checkGA();
    const timer = setTimeout(checkGA, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  const getStatusColor = (isOk: boolean) => isOk ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-80 text-white p-4 m-4 rounded text-xs z-50 font-mono">
      <h3 className="font-bold mb-2 text-sm">Google Analytics Debug:</h3>
      <ul className="space-y-1">
        <li>
          Measurement ID: {' '}
          <span className={getStatusColor(!!status.measurementId)}>
            {status.measurementId || 'MISSING'}
          </span>
        </li>
        <li>
          Script loaded: {' '}
          <span className={getStatusColor(status.scriptLoaded)}>
            {status.scriptLoaded ? 'YES' : 'NO'}
          </span>
        </li>
        <li>
          gtag function: {' '}
          <span className={getStatusColor(status.gtagDefined)}>
            {status.gtagDefined ? 'DEFINED' : 'UNDEFINED'}
          </span>
        </li>
        <li>
          dataLayer: {' '}
          <span className={getStatusColor(status.dataLayerDefined)}>
            {status.dataLayerDefined ? 'DEFINED' : 'UNDEFINED'}
          </span>
        </li>
      </ul>
      <div className="mt-2 text-xs opacity-70">
        Check browser console for more details
      </div>
    </div>
  );
} 