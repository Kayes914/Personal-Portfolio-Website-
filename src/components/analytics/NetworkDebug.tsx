'use client';

import { useEffect, useState } from 'react';

export default function NetworkDebug() {
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const capturedRequests: string[] = [];
    
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
      
      if (url.includes('google-analytics') || url.includes('analytics')) {
        capturedRequests.push(`Fetch: ${url}`);
        setRequests(prev => [...prev, `Fetch: ${url}`]);
        
        // Try to find the source
        try {
          throw new Error('Stack trace');
        } catch (e) {
          console.log('Analytics request from:', e);
        }
      }
      
      return originalFetch.apply(this, [input, init as any]);
    };

    // Monitor XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && (url.includes('google-analytics') || url.includes('analytics'))) {
        capturedRequests.push(`XHR: ${url}`);
        setRequests(prev => [...prev, `XHR: ${url}`]);
        
        // Try to find the source
        try {
          throw new Error('Stack trace');
        } catch (e) {
          console.log('Analytics XHR request from:', e);
        }
      }
      
      return originalXHROpen.apply(this, arguments as any);
    };

    // Monitor script tags
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
              const scriptNode = node as HTMLScriptElement;
              if (scriptNode.src && (scriptNode.src.includes('google-analytics') || scriptNode.src.includes('analytics'))) {
                capturedRequests.push(`Script: ${scriptNode.src}`);
                setRequests(prev => [...prev, `Script: ${scriptNode.src}`]);
                console.log('Analytics script added:', scriptNode.src);
                
                // Try to find the source
                try {
                  throw new Error('Stack trace');
                } catch (e) {
                  console.log('Analytics script from:', e);
                }
              }
            }
          });
        }
      });
    });
    
    observer.observe(document, { childList: true, subtree: true });

    // Check for any existing scripts
    document.querySelectorAll('script').forEach(script => {
      if (script.src && (script.src.includes('google-analytics') || script.src.includes('analytics'))) {
        capturedRequests.push(`Existing Script: ${script.src}`);
        setRequests(prev => [...prev, `Existing Script: ${script.src}`]);
      }
    });

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      observer.disconnect();
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 bg-black bg-opacity-90 text-white p-4 m-4 rounded text-xs z-50 font-mono max-w-md max-h-96 overflow-auto">
      <h3 className="font-bold mb-2">Network Debug:</h3>
      {requests.length === 0 ? (
        <div>No analytics requests detected yet</div>
      ) : (
        <ul className="list-disc pl-4">
          {requests.map((req, i) => (
            <li key={i} className="truncate">{req}</li>
          ))}
        </ul>
      )}
    </div>
  );
} 