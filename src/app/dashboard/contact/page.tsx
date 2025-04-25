"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface ContactSettings {
  id: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
  };
}

const defaultSettings: ContactSettings = {
  id: '',
  title: 'Let\'s Connect',
  description: 'Feel free to reach out through any of these channels',
  email: 'your.email@example.com',
  phone: '+1 234 567 890',
  location: 'Your Location, Country',
  social_links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    facebook: 'https://facebook.com/yourusername'
  }
};

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: true })
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      toast.error('Failed to fetch contact settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('contact_settings')
        .update(settings)
        .eq('id', settings.id);

      if (error) throw error;

      toast.success('Contact settings updated successfully');
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast.error('Failed to save contact settings');
    }
  };

  const content = loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ) : (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200">Contact Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-200">Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-200">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-slate-200">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-slate-200">Location</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">Social Links</h3>
              <div>
                <Label htmlFor="github" className="text-slate-200">GitHub</Label>
                <Input
                  id="github"
                  value={settings.social_links.github}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, github: e.target.value }
                  })}
                  className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="linkedin" className="text-slate-200">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social_links.linkedin}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, linkedin: e.target.value }
                  })}
                  className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-slate-200">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.social_links.twitter}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, twitter: e.target.value }
                  })}
                  className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="facebook" className="text-slate-200">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social_links.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value }
                  })}
                  className="bg-slate-800 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
} 