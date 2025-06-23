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
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'ssr-fallback';
  }
  
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
    // Directly count projects instead of using stored procedure
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      throw projectsError;
    }

    const totalCount = projects?.length || 0;
    const monthlyChange = projects?.filter(project => 
      new Date(project.created_at) >= new Date(new Date().setDate(1))
    ).length || 0;

    // Get daily and monthly views using RPC
    const { data: dailyStats } = await supabase.rpc('get_daily_views');
    const { data: monthlyStats } = await supabase.rpc('get_monthly_views');

    const result = {
      projects: {
        total: totalCount,
        monthlyChange: monthlyChange
      },
      dailyViews: {
        today: dailyStats?.[0]?.today_count || 0,
        yesterday: dailyStats?.[0]?.yesterday_count || 0
      },
      monthlyViews: {
        current: monthlyStats?.[0]?.current_month_count || 0,
        last: monthlyStats?.[0]?.last_month_count || 0
      }
    };

    return result;
  } catch (error) {
    return null;
  }
}; 