"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success?: string; error?: string} | null>(null);

  // Initialize the projects table
  const setupProjectsTable = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("Starting database setup...");
      
      // Try to create the table directly
      console.log("Creating projects table...");
      const { error } = await supabase.rpc(
        'create_table', 
        { 
          table_name: 'projects',
          table_definition: `
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT NOT NULL,
            is_long_image BOOLEAN DEFAULT FALSE,
            tech JSONB DEFAULT '[]'::jsonb,
            live_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ
          `
        }
      );
      
      if (error) {
        console.error("Error creating table with RPC:", error);
        
        // Direct approach - execute raw SQL query
        console.log("Trying direct SQL approach...");
        
        // This API call is simpler and more reliable
        const { error: sqlError } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
          
        if (sqlError && sqlError.code === '42P01') {
          // Table doesn't exist, create it (using SQL Editor in Supabase dashboard)
          console.log("Table doesn't exist - showing manual instructions");
          throw new Error("Table 'projects' doesn't exist. Please create it manually using the SQL in the instructions below.");
        } else if (!sqlError) {
          // Table already exists
          console.log("Projects table already exists");
          setResult({ success: "Projects table already exists!" });
          return;
        } else {
          // Other error occurred
          throw sqlError;
        }
      } else {
        console.log("Table created successfully");
        setResult({ success: "Database setup completed successfully!" });
      }
    } catch (error: any) {
      console.error("Setup failed:", error);
      setResult({ error: `Setup failed: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Database Setup</h1>
        <p className="text-slate-400 mb-6">
          This page helps you initialize your database structure. Due to permission limitations,
          you'll likely need to create the table manually following the instructions below.
        </p>
        
        <button
          onClick={setupProjectsTable}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            isLoading 
              ? 'bg-slate-700 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? 'Checking setup...' : 'Check Database Setup'}
        </button>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success 
              ? 'bg-green-900/20 border border-green-900/40 text-green-300' 
              : 'bg-red-900/20 border border-red-900/40 text-red-300'
          }`}>
            {result.success || result.error}
          </div>
        )}
        
        <div className="mt-8 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Manual Setup Instructions</h2>
          
          <div className="bg-slate-800/50 p-4 rounded-md text-slate-300">
            <p className="mb-2">Follow these steps to set up your database manually:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to your <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase Dashboard</a></li>
              <li>Select your project</li>
              <li>Go to the SQL Editor (in the left sidebar)</li>
              <li>Create a new query</li>
              <li>Copy and paste the following SQL:</li>
            </ol>
            
            <pre className="bg-slate-900 p-4 rounded-md my-4 overflow-x-auto text-sm text-slate-300">
{`CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT NOT NULL,
  is_long_image BOOLEAN DEFAULT FALSE,
  tech JSONB DEFAULT '[]'::jsonb,
  live_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);`}
            </pre>
            
            <p>After executing the SQL, click the "Run" button to create the table.</p>
            <p className="mt-4">Then, navigate to <a href="/dashboard/works" className="text-blue-400 hover:text-blue-300">Projects</a> to manage your portfolio.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 