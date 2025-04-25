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
    console.log('Fetching dashboard stats...');
    
    // Directly count projects instead of using stored procedure
    console.log('Fetching projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    console.log('Projects data:', projects);
    console.log('Projects error:', projectsError);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      throw projectsError;
    }

    const totalCount = projects?.length || 0;
    const monthlyChange = projects?.filter(project => 
      new Date(project.created_at) >= new Date(new Date().setDate(1))
    ).length || 0;

    console.log('Project counts:', { totalCount, monthlyChange });

    // Get daily and monthly views using RPC
    const { data: dailyStats } = await supabase.rpc('get_daily_views');
    const { data: monthlyStats } = await supabase.rpc('get_monthly_views');

    console.log('Daily stats:', dailyStats);
    console.log('Monthly stats:', monthlyStats);

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

    console.log('Final dashboard stats:', result);
    return result;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}; 