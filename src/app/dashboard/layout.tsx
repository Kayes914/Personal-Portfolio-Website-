"use client";

// This file is needed for Next.js routing and to provide consistent layout
// We're making it a client component to avoid hydration errors

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-950">{children}</div>;
} 