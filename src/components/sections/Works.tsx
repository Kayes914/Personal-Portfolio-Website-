"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Globe, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isLongImage: boolean;
  category: 'web' | 'app';
  tech: string[];
  links: {
    live: string;
    github?: string;
  }
}

const Works = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'app'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6; // 2 rows of 3 projects
  
  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          setProjects([]);
          return;
        }
        
        // Transform data from Supabase format to our component format
        const formattedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          image: item.image || '',
          category: item.category as 'web' | 'app',
          isLongImage: item.is_long_image || false,
          tech: item.tech || [],
          links: {
            live: item.live_url || '',
            github: item.github_url || undefined
          }
        }));
        
        setProjects(formattedProjects);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of projects section
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <section id="works" className="relative py-24 overflow-hidden">
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Recent Works
          </motion.h2>
          <motion.p 
            className="text-lg text-slate-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore some of my latest projects, showcasing my expertise in building
            modern web applications and mobile apps.
          </motion.p>
          
          {/* Filter buttons */}
          <motion.div 
            className="flex justify-center space-x-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              All Projects
            </button>
            <button 
              onClick={() => setActiveCategory('web')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === 'web' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              Web
            </button>
            <button 
              onClick={() => setActiveCategory('app')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === 'app' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              Apps
            </button>
          </motion.div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400">No projects found in this category.</p>
          </div>
        ) : (
          <>
            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-white hover:bg-slate-800'
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => paginate(idx + 1)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === idx + 1
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-white hover:bg-slate-800'
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// ImageModal Component
const ImageModal = ({ 
  isOpen, 
  onClose, 
  image, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  image: string; 
  title: string;
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all duration-200 z-[101] shadow-lg hover:shadow-white/20"
        >
          <X size={24} />
        </button>
        
        {/* Image container */}
        <div 
          className="min-h-full flex items-start justify-center px-1 md:px-1 pt-20"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <img 
            src={image} 
            alt={title}
            className="w-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '75vw' }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

// ProjectCard component
const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800/70 shadow-xl transition-all duration-300 hover:shadow-purple-900/20 hover:border-slate-700/80 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsModalOpen(true)}
    >
      {/* Project image - 16:9 aspect ratio */}
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        {/* Image container */}
        <div className="absolute inset-0 overflow-hidden">
          {!project.image ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-lg text-white/70 font-medium px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-lg">
                {project.isLongImage ? 'Project Screenshot' : 'App Screenshot'}
              </p>
            </div>
          ) : (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-black/50 px-4 py-2 rounded-lg text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view details
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project details */}
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">
            {project.title}
          </h3>
          <span className="px-3 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 rounded-full">
            {project.category === 'web' ? 'Web' : 'App'}
          </span>
        </div>
        <p className="text-slate-300 mb-6">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech: string) => (
            <span 
              key={tech} 
              className="px-3 py-1 text-xs font-medium bg-slate-800/60 text-slate-300 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-6">
          <Link 
            href={project.links.live} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600/90 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors duration-300 ml-auto"
          >
            <Globe className="w-4 h-4 mr-2" />
            Live Demo
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={project.image}
        title={project.title}
      />
    </motion.div>
  );
};

export default Works; 