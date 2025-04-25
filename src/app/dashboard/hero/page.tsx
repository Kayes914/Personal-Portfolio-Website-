"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

type Status = 'available' | 'busy' | 'offline';

interface HeroSettings {
  id: string;
  status: Status;
  available_text: string;
  busy_text: string;
  offline_text: string;
}

const defaultTexts: Record<Status, string> = {
  available: "I'm available for new projects",
  busy: "I'm really busy right now",
  offline: "I'm currently offline"
};

const statusConfig = {
  available: {
    icon: CheckCircle2,
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    hoverColor: 'hover:bg-green-500/20'
  },
  busy: {
    icon: AlertCircle,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverColor: 'hover:bg-orange-500/20'
  },
  offline: {
    icon: XCircle,
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    hoverColor: 'hover:bg-red-500/20'
  }
};

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroSettings>({
    id: '00000000-0000-0000-0000-000000000000',
    status: 'available',
    available_text: defaultTexts.available,
    busy_text: defaultTexts.busy,
    offline_text: defaultTexts.offline
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching hero settings...');
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched data:', data);

      if (data) {
        setSettings({
          id: data.id,
          status: data.status || 'available',
          available_text: data.available_text || defaultTexts.available,
          busy_text: data.busy_text || defaultTexts.busy,
          offline_text: data.offline_text || defaultTexts.offline
        });
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Failed to load hero settings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: Status) => {
    setSettings(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      
      // First, get the first record's ID
      const { data: firstRecord, error: fetchError } = await supabase
        .from('hero_settings')
        .select('id')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      if (!firstRecord) {
        throw new Error('No existing record found');
      }

      // Update using the first record's ID
      const { data, error } = await supabase
        .from('hero_settings')
        .update({
          status: settings.status,
          available_text: settings.available_text,
          busy_text: settings.busy_text,
          offline_text: settings.offline_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', firstRecord.id)
        .select()
        .single();

      if (error) {
        console.error('Save error:', error);
        throw error;
      }

      console.log('Save successful:', data);
      
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      }
      
      toast.success('Hero settings updated successfully');
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  const getStatusText = (status: Status): string => {
    return settings[`${status}_text` as keyof HeroSettings] as string;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Hero Section Settings</h1>
            <p className="text-slate-400 mt-2">
              Manage your availability status and messages
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Current Status</h2>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full ${statusConfig[settings.status].color} animate-pulse`} />
                <span className={`font-medium ${statusConfig[settings.status].textColor}`}>
                  {settings.status.charAt(0).toUpperCase() + settings.status.slice(1)}
                </span>
              </div>
              <p className="text-slate-400">
                {getStatusText(settings.status)}
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Change Status</h2>
              <div className="grid gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  const statusKey = status as Status;
                  const isSelected = settings.status === statusKey;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(statusKey)}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        isSelected
                          ? `${config.bgColor} ${config.borderColor} border-2`
                          : 'border-slate-800 bg-slate-900/30 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${isSelected ? config.bgColor : 'bg-slate-800'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? config.textColor : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-white">
                          {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {getStatusText(statusKey)}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 