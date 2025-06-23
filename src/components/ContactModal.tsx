"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, MapPin, ExternalLink, Facebook, Copy, Check, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContactSettings {
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

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      // Silently handle error and use default settings
    }
  };

  useEffect(() => {
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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(settings.email);
      setIsEmailRevealed(true);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback copy method if clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = settings.email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsEmailRevealed(true);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{settings.title}</h2>
                <p className="text-slate-400">{settings.description}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-slate-400 group-hover:text-white transition-colors">
                      {isEmailRevealed ? settings.email : '••••••••••••••••'}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg hover:bg-slate-700/50 flex items-center gap-2"
                    title={isCopied ? "Copied!" : "Copy to reveal"}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy to reveal</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Location</h3>
                    <p className="text-slate-400">{settings.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={settings.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <Github className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">GitHub</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                  </a>

                  <a
                    href={settings.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <Linkedin className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">LinkedIn</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                  </a>

                  <a
                    href={settings.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <Phone className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">WhatsApp</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                  </a>

                  <a
                    href={settings.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                      <Facebook className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">Facebook</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 