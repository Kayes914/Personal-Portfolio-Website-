"use client";

import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Globe, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/app/dashboard/works/page';

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const ProjectsList = ({ projects, onEdit, onDelete }: ProjectsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          index={index} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Separated ProjectCard component with the design from Works.tsx
const ProjectCard = ({ 
  project, 
  index,
  onEdit,
  onDelete
}: { 
  project: Project, 
  index: number,
  onEdit: (project: Project) => void,
  onDelete: (id: number) => void
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Simpler approach to scrolling using CSS animation control
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    if (isHovering && project.isLongImage) {
      // Add animation class when hovering
      imageContainerRef.current.classList.add('scrolling');
    } else {
      // Remove animation when not hovering
      imageContainerRef.current.classList.remove('scrolling');
    }
  }, [isHovering, project.isLongImage]);

  return (
    <div
      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800/70 shadow-xl transition-all duration-300 hover:shadow-purple-900/20 hover:border-slate-700/80 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Project image - 16:9 aspect ratio */}
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        {/* Image container */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Scrollable content container with CSS-based animation */}
          <div
            ref={imageContainerRef}
            className={`w-full h-full relative image-scroll-container ${project.isLongImage ? 'has-scroll-content' : ''}`}
          >
            {/* Background placeholder if no image or while loading */}
            {!project.image ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <p className="text-lg text-white/70 font-medium px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-lg">
                  {project.isLongImage ? 'Project Screenshot' : 'App Screenshot'}
                </p>
              </div>
            ) : (
              /* The actual scrolling background image */
              <div className="absolute inset-0 bg-image-container">
                <div 
                  className="scroll-image"
                  style={{
                    backgroundImage: `url(${project.image})`,
                  }}
                />
              </div>
            )}
          </div>
          
          {/* CSS for scrolling animation */}
          <style jsx>{`
            .image-scroll-container {
              overflow: hidden;
              position: relative;
            }
            
            .bg-image-container {
              width: 100%;
              height: 100%;
              overflow: hidden;
              position: relative;
            }
            
            .scroll-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 700%;
              background-size: 100% auto;
              background-repeat: no-repeat;
              background-position: top center;
              transform: translateY(0);
            }
            
            .scrolling .scroll-image {
              animation: scrollImage 10s linear infinite;
            }
            
            @keyframes scrollImage {
              0%, 5% { transform: translateY(0); }
              40% { transform: translateY(-85.5%); }
              50% { transform: translateY(-85.5%); }
              55% { transform: translateY(0); }
              100% { transform: translateY(0); }
            }
          `}</style>
        </div>
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-30 pointer-events-none" />
        
        {/* Scroll indicator for long images */}
        {project.isLongImage && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-slate-300">
            Hover to see full page
          </div>
        )}

        {/* Edit and Delete buttons (only visible on hover) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
          <button 
            onClick={() => onEdit(project)} 
            className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            title="Edit project"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(project.id)} 
            className="p-2 rounded-full bg-red-800/80 hover:bg-red-700 text-white transition-colors"
            title="Delete project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Project details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">
            {project.title}
          </h3>
          <span className="px-3 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 rounded-full">
            {project.category === 'web' ? 'Web' : 'App'}
          </span>
        </div>
        <p className="text-slate-300 mb-6 line-clamp-2">
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
          <button 
            onClick={() => onEdit(project)}
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors duration-300"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </button>
          
          <a 
            href={project.links.live} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600/90 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors duration-300 ml-auto"
          >
            <Globe className="w-4 h-4 mr-2" />
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList; 