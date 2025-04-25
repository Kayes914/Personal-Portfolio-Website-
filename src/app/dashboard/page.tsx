"use client";

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { FolderKanban, Eye, Calendar } from 'lucide-react';

export default function DashboardHomePage() {
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      icon: FolderKanban,
      color: 'bg-gradient-to-br from-purple-500 to-blue-500',
      trend: '+2 this month'
    },
    {
      title: 'Daily Views',
      value: '247',
      icon: Eye,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      trend: '+12% from yesterday'
    },
    {
      title: 'Monthly Views',
      value: '5.2K',
      icon: Calendar,
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      trend: '+5% from last month'
    }
  ];

  return (
    <DashboardLayout>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Monitor your portfolio performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400">{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
} 