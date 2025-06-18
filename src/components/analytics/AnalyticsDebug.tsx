'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsDebug() {
  const [debug, setDebug] = useState<{
    envVar: string | null;
    windowDataLayer: any[];
    windowGtag: boolean;
    scripts: string[];
    requests: string[];
    headScripts: string[];
  }>({
    envVar: null,
    windowDataLayer: [],
    windowGtag: false,
    scripts: [],
    requests: [],
    headScripts: []
  });

  useEffect(() => {
    // Get environment variable
    const envVar = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
    
    // Check window objects
    const windowDataLayer = window.dataLayer || [];
    const windowGtag = typeof window.gtag === 'function';
    
    // Get all script tags in head
    const headScriptElements = document.head.querySelectorAll('script');
    const headScripts: string[] = [];
    headScriptElements.forEach(script => {
      if (script.src) {
        headScripts.push(script.src);
      } else if (script.innerHTML && script.innerHTML.includes('gtag')) {
        headScripts.push(script.innerHTML.substring(0, 100) + '...');
      }
    });
    
    // Get all script tags in body
    const scriptElements = document.body.querySelectorAll('script');
    const scripts: string[] = [];
    scriptElements.forEach(script => {
      if (script.src && script.src.includes('google')) {
        scripts.push(script.src);
      }
      if (script.innerHTML && script.innerHTML.includes('gtag')) {
        scripts.push(script.innerHTML.substring(0, 100) + '...');
      }
    });

    // Monitor network requests for GA
    const requests: string[] = [];
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
      if (url.includes('google-analytics') || url.includes('analytics')) {
        requests.push(url);
      }
      return originalFetch.apply(this, [input, init as any]);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && (url.includes('google-analytics') || url.includes('analytics'))) {
        requests.push(url);
      }
      return originalXHROpen.apply(this, arguments as any);
    };

    // Update state
    setDebug({
      envVar,
      windowDataLayer,
      windowGtag,
      scripts,
      requests,
      headScripts
    });

    // Log to console for easier debugging
    console.log('Analytics Debug:', {
      envVar,
      windowDataLayer,
      windowGtag,
      scripts,
      headScripts
    });

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-90 text-white p-4 m-4 rounded text-xs z-50 font-mono max-w-md max-h-96 overflow-auto">
      <h3 className="font-bold mb-2">Analytics Debug:</h3>
      
      <div className="mb-2">
        <strong>Environment Variable:</strong> {debug.envVar || 'not set'}
      </div>
      
      <div className="mb-2">
        <strong>Window Objects:</strong>
        <div>dataLayer: {debug.windowDataLayer.length > 0 ? 'exists' : 'not found'}</div>
        <div>gtag function: {debug.windowGtag ? 'exists' : 'not found'}</div>
      </div>
      
      <div className="mb-2">
        <strong>Head Scripts:</strong>
        {debug.headScripts.length === 0 ? (
          <div>No Google scripts found in head</div>
        ) : (
          <ul className="list-disc pl-4">
            {debug.headScripts.map((script, i) => (
              <li key={i} className="truncate">{script}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-2">
        <strong>Body Scripts:</strong>
        {debug.scripts.length === 0 ? (
          <div>No Google scripts found in body</div>
        ) : (
          <ul className="list-disc pl-4">
            {debug.scripts.map((script, i) => (
              <li key={i} className="truncate">{script}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div>
        <strong>Network Requests:</strong>
        {debug.requests.length === 0 ? (
          <div>No analytics requests detected</div>
        ) : (
          <ul className="list-disc pl-4">
            {debug.requests.map((url, i) => (
              <li key={i} className="truncate">{url}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 