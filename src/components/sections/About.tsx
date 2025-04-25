"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background with gradient mesh and particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Mesh gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        </div>
        
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
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">
            About Me
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] lg:aspect-auto lg:h-[540px]"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
                <Image
                  src="/your-image.jpg"
                  alt="Your Name"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Crafting Digital Experiences with Modern Web Technologies
                </h3>
                
                <div className="space-y-6 text-slate-300 text-lg">
                  <p>
                    Hello! I'm [Your Name], a Full Stack Web Developer passionate about creating 
                    innovative digital solutions. With expertise in React, Next.js, Laravel, and Node.js, 
                    I specialize in building scalable and user-friendly web applications.
                  </p>
                  
                  <p>
                    My approach combines clean code practices with modern development tools to deliver 
                    high-quality solutions. I focus on creating seamless user experiences while ensuring 
                    robust and efficient server-side operations.
                  </p>

                  <p>
                    When I'm not coding, I'm constantly exploring new technologies and best practices 
                    to stay at the forefront of web development. I believe in writing clean, maintainable 
                    code and creating applications that make a difference.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Let's Connect
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#works"
                    className="text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    View My Work
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 