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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {projects.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p className="text-slate-400">No projects found. Add your first project!</p>
        </div>
      ) : (
        projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

// Smaller, more compact ProjectCard component
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
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 group">
      {/* Project Image */}
      <div className="aspect-video mb-3 rounded-md overflow-hidden bg-slate-700">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
      </div>

      {/* Project Info */}
      <h3 className="text-white font-medium mb-2 truncate" title={project.title}>
        {project.title}
      </h3>
      
      {/* Client badge for client projects */}
      {project.isClientProject && (
        <span className="inline-block px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full mb-2">
          Client: {project.client || 'Confidential'}
        </span>
      )}
      
      {/* Tech tags - show max 2 */}
      <div className="flex flex-wrap gap-1 mb-2">
        {project.tech.slice(0, 2).map((tech, i) => (
          <span 
            key={i} 
            className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded-full"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 2 && (
          <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded-full">
            +{project.tech.length - 2}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <button 
          onClick={() => onEdit(project)}
          className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors duration-200"
        >
          Edit
        </button>
        <button 
          onClick={() => project.id !== undefined ? onDelete(project.id) : null}
          className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectsList; 