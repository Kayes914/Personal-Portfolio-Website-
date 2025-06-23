import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hook to prevent hydration mismatches
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

// Counter for generating deterministic IDs
let idCounter = 0;

// Generate deterministic IDs for SSR
export function generateSSRSafeId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}`;
}
