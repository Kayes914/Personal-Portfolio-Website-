module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['i.ibb.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://ielnmrbzdausronymhdc.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbG5tcmJ6ZGF1c3JvbnltaGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTk3MjksImV4cCI6MjA2MDM3NTcyOX0.CKIqa7294ynyV5EE0P3ZPfbsWytmFgolp6vRp6zhPss"
  }
} 