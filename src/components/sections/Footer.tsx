"use client";

import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: <Github className="w-5 h-5" />
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: <Linkedin className="w-5 h-5" />
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/yourusername',
    icon: <Twitter className="w-5 h-5" />
  },
  {
    name: 'Email',
    href: 'mailto:your.email@example.com',
    icon: <Mail className="w-5 h-5" />
  }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                © {currentYear} Your Name. All rights reserved.
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
};

export default Footer; 