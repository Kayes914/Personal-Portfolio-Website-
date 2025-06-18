// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Get the measurement ID from environment variable only
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Log the measurement ID during initialization
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Analytics initialized with ID:', GA_MEASUREMENT_ID);
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics not initialized: Missing measurement ID or not in browser');
    }
    return;
  }

  try {
    // Clear any existing GA cookies to prevent using old/incorrect data
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    // Set initial gtag configuration
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll trigger page views manually
      cookie_flags: 'max-age=7200;secure;samesite=none'
    });
    
    console.log('Google Analytics initialized successfully with ID:', GA_MEASUREMENT_ID);
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      send_page_view: true
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Page view tracked:', url, 'with ID:', GA_MEASUREMENT_ID);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Event tracked:', { action, category, label, value });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}; 