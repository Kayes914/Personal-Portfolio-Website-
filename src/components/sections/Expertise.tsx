"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, Server, Layout, Database, Terminal } from 'lucide-react';

interface Skill {
  name: string;
  icon: ReactNode;
  description: string;
  technologies: string[];
  color: string;
}

const skills: Skill[] = [
  {
    name: "Frontend Development",
    icon: <Globe className="w-8 h-8" />,
    description: "Building modern and responsive web applications",
    technologies: ["React", "Next.js", "Tailwind CSS", "Bootstrap", "JavaScript"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Backend Development",
    icon: <Server className="w-8 h-8" />,
    description: "Creating robust server-side applications and APIs",
    technologies: ["Laravel", "Node.js", "PHP", "Express.js",],
    color: "from-purple-500 to-indigo-500"
  },
  {
    name: "Full-Stack Applications",
    icon: <Layout className="w-8 h-8" />,
    description: "Developing complete web solutions from frontend to backend",
    technologies: ["Next.js", "Laravel", "Full-Stack React", "API Integration", "State Management"],
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Database Management",
    icon: <Database className="w-8 h-8" />,
    description: "Working with various database systems and data modeling",
    technologies: ["MySQL", "PostgreSQL", "MongoDB", "Database Design", "Query Optimization"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "Modern Development",
    icon: <Code2 className="w-8 h-8" />,
    description: "Implementing modern development practices and tools",
    technologies: ["TypeScript", "Git", "npm/yarn", "Webpack", "ESLint"],
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "Web Performance",
    icon: <Terminal className="w-8 h-8" />,
    description: "Optimizing web applications for speed and efficiency",
    technologies: ["Code Splitting", "Lazy Loading", "Caching", "Performance Metrics", "SEO"],
    color: "from-red-500 to-rose-500"
  }
];


const Expertise = () => {
  return (
    <section id="expertise" className="relative py-24 overflow-hidden">
      {/* Improved background with gradient mesh and particles */}
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
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400">
            Technical Expertise
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Leveraging cutting-edge technologies to build modern, scalable, and user-friendly applications
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm h-[320px] flex flex-col">
                {/* Icon with gradient background - made square and centered */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} text-white mb-4 shadow-lg`}>
                  {skill.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                  {skill.name}
                </h3>
                <p className="text-slate-300 mb-4">
                  {skill.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise; 