"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, MapPin, ExternalLink, Facebook, Copy, Check, Phone } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactInfo = {
  email: "your.email@example.com",
  location: "Your Location, Country",
  whatsapp: "+1234567890",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/yourusername",
      icon: <Github className="w-5 h-5" />
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      name: "Facebook",
      url: "https://facebook.com/yourusername",
      icon: <Facebook className="w-5 h-5" />
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/${"+1234567890"}`,
      icon: <Phone className="w-5 h-5" />
    }
  ]
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [isEmailRevealed, setIsEmailRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setIsEmailRevealed(true);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
                <p className="text-slate-400">
                  Feel free to reach out through any of these channels
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-slate-400 group-hover:text-white transition-colors">
                      {isEmailRevealed ? contactInfo.email : '••••••••••••••••'}
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

                {/* Location */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Location</h3>
                    <p className="text-slate-400">{contactInfo.location}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-2 gap-4">
                  {contactInfo.socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                        {social.icon}
                      </div>
                      <span className="text-slate-400 group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal; 