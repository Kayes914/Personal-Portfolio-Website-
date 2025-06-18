// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics utility functions
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    // Clear any existing GA cookies
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
      cookie_flags: 'max-age=7200;secure;samesite=none'
    });
    
    console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      send_page_view: true
    });
    console.log('Pageview tracked:', url);
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}; 