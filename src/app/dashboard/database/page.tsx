"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * This file serves as a redirect to the database setup page
 * We're using this approach to create a better folder structure
 * while maintaining Next.js routing
 */
export default function DatabaseIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the database setup page
    router.push('/dashboard/database/setup');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
        <p className="text-slate-400">Redirecting to Database Setup...</p>
      </div>
    </div>
  );
} 