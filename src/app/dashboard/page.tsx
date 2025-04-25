"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { FolderKanban, Eye, Calendar } from 'lucide-react';
import { getDashboardStats } from '@/lib/utils/analytics';

interface DashboardStats {
  projects: {
    total: number;
    monthlyChange: number;
  };
  dailyViews: {
    today: number;
    yesterday: number;
  };
  monthlyViews: {
    current: number;
    last: number;
  };
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Dashboard: Starting to fetch stats...');
        const data = await getDashboardStats();
        console.log('Dashboard: Received stats:', data);
        setStats(data);
      } catch (error) {
        console.error('Dashboard: Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total Projects',
      value: stats?.projects.total.toString() || '0',
      icon: FolderKanban,
      color: 'bg-gradient-to-br from-purple-500 to-blue-500',
      trend: `+${stats?.projects.monthlyChange || 0} this month`
    },
    {
      title: 'Daily Views',
      value: stats?.dailyViews.today.toString() || '0',
      icon: Eye,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      trend: stats?.dailyViews.yesterday ? 
        `${Math.round(((stats.dailyViews.today - stats.dailyViews.yesterday) / stats.dailyViews.yesterday) * 100)}% from yesterday` : 
        'No previous data'
    },
    {
      title: 'Monthly Views',
      value: stats?.monthlyViews.current.toString() || '0',
      icon: Calendar,
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      trend: stats?.monthlyViews.last ? 
        `${Math.round(((stats.monthlyViews.current - stats.monthlyViews.last) / stats.monthlyViews.last) * 100)}% from last month` : 
        'No previous data'
    }
  ];

  console.log('Dashboard: Current stats state:', stats);
  console.log('Dashboard: Loading state:', loading);

  return (
    <DashboardLayout>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Monitor your portfolio performance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {statsData.map((stat) => (
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
      )}
    </DashboardLayout>
  );
} 