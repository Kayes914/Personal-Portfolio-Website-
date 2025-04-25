import { supabase } from '@/lib/supabase';

interface ProjectStats {
  total_count: number;
  monthly_change: number;
}

interface DailyStats {
  today_count: number;
  yesterday_count: number;
}

interface MonthlyStats {
  current_month_count: number;
  last_month_count: number;
}

// Generate a visitor ID if not exists
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Track page view
export const trackPageView = async (pagePath: string) => {
  try {
    const visitorId = getVisitorId();
    await supabase.from('page_views').insert({
      page_path: pagePath,
      visitor_id: visitorId
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const [
      { data: projectStats },
      { data: dailyStats },
      { data: monthlyStats }
    ] = await Promise.all([
      supabase.rpc<ProjectStats>('get_total_projects').single(),
      supabase.rpc<DailyStats>('get_daily_views').single(),
      supabase.rpc<MonthlyStats>('get_monthly_views').single()
    ]);

    return {
      projects: {
        total: projectStats?.total_count || 0,
        monthlyChange: projectStats?.monthly_change || 0
      },
      dailyViews: {
        today: dailyStats?.today_count || 0,
        yesterday: dailyStats?.yesterday_count || 0
      },
      monthlyViews: {
        current: monthlyStats?.current_month_count || 0,
        last: monthlyStats?.last_month_count || 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}; 