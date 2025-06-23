'use client';

import { useEffect } from 'react';

export default function AnalyticsReset() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all GA cookies
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Clear any Google Analytics related cookies
        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure; samesite=none`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; secure; samesite=none`;
        }
      }
      
      // Reset dataLayer if it exists
      if ('dataLayer' in window) {
        window.dataLayer = [];
      }
    }
  }, []);

  return null;
} 