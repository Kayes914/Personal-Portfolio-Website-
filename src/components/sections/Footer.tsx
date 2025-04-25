"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContactSettings {
  email: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
  };
}

const defaultSettings: ContactSettings = {
  email: 'your.email@example.com',
  social_links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    facebook: 'https://facebook.com/yourusername'
  }
};

export default function Footer() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('email, social_links')
          .limit(1)
          .order('created_at', { ascending: true })
          .single();

        if (error) throw error;

        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      }
    };

    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      .channel('contact_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_settings'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      href: settings.social_links.github,
      icon: <Github className="w-5 h-5" />
    },
    {
      name: 'LinkedIn',
      href: settings.social_links.linkedin,
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      name: 'Twitter',
      href: settings.social_links.twitter,
      icon: <Twitter className="w-5 h-5" />
    },
    {
      name: 'Facebook',
      href: settings.social_links.facebook,
      icon: <Facebook className="w-5 h-5" />
    },
    {
      name: 'Email',
      href: `mailto:${settings.email}`,
      icon: <Mail className="w-5 h-5" />
    }
  ];

  return (
    <footer className="relative py-12 overflow-hidden border-t border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Copyright and Links */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <Link 
                  href="#home" 
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="#about" 
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="#works" 
                  className="hover:text-white transition-colors"
                >
                  Works
                </Link>
                <Link 
                  href="#contact" 
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Kayes. All rights reserved.
              </p>
            </div>

            {/* Right side - Social Links */}
            <div className="flex justify-start md:justify-end gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 