"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  project_title?: string;
  project_type?: string;
  client_location?: string;
  is_featured: boolean;
  is_active: boolean;
}

// Static testimonials data
const staticTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Abdullah An Nyeem',
    position: 'Client',
    company: 'Personal Project',
    content: 'Working with Kayes was an excellent experience. He delivered exactly what I needed with great attention to detail and professional communication throughout the project. Highly recommend his services!',
    rating: 5,
    avatar_url: undefined,
    project_title: 'Custom Web Application',
    project_type: 'web',
    client_location: 'Bangladesh',
    is_featured: true,
    is_active: true
  }
];

const Testimonials = () => {
  // Use static data
  const testimonials = staticTestimonials.filter(t => t.is_active);

  if (testimonials.length === 0) {
    return null; // Don't render if no testimonials
  }

  return (
    <section id="testimonials" className="relative py-16 overflow-hidden bg-[#0B1120]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/30">
            <Quote className="w-4 h-4 mr-2 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Client Feedback</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            What Clients Say
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working with me.
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Testimonial Cards Container */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <TestimonialCard testimonial={testimonials[0]} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Statistics Section - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 sm:mt-12"
        >
          <div className="flex flex-row justify-center gap-4 sm:gap-6 md:gap-8 max-w-lg sm:max-w-2xl mx-auto">
            <div className="text-center flex-1">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-700/30">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2 flex items-center justify-center">
                  <span>{testimonials.length > 0 ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1) : '5.0'}</span>
                  <Star className="inline w-3 sm:w-5 md:w-6 h-3 sm:h-5 md:h-6 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-slate-300">Client Rating</div>
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-700/30">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-400 mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm md:text-base text-slate-300">Success Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/30 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
      
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="w-16 h-16 text-cyan-400" />
      </div>

      <div className="relative z-10">
        {/* Rating Stars */}
        <div className="flex items-center mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-600'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-slate-400">({testimonial.rating}/5)</span>
        </div>

        {/* Testimonial Content */}
        <blockquote className="text-base md:text-lg text-slate-200 leading-relaxed mb-6 italic">
          "{testimonial.content}"
        </blockquote>

        {/* Client Info & Project Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Client Info */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              {testimonial.avatar_url && !imageError ? (
                <Image
                  src={testimonial.avatar_url}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-cyan-400/20"
                  onError={() => setImageError(true)}
                />
              ) : (
                                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-cyan-400/20">
                  {getInitials(testimonial.name)}
                </div>
              )}
            </div>

            {/* Name & Company */}
            <div>
              <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
              <p className="text-cyan-400 text-sm">{testimonial.company}</p>
            </div>
          </div>

          {/* Project Details */}
          {testimonial.project_title && (
            <div className="flex flex-col md:items-end space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>{testimonial.project_title}</span>
              </div>
              {testimonial.project_type && (
                <div className="inline-flex items-center px-2 py-1 bg-slate-700/50 rounded-full text-xs text-cyan-400 border border-cyan-400/20">
                  {testimonial.project_type.toUpperCase()}
                </div>
              )}
              {testimonial.client_location && (
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{testimonial.client_location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for initials (moved outside component to avoid recreation)
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default Testimonials; 