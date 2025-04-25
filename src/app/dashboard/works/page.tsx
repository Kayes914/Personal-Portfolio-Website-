"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProjectsList, ProjectForm } from '@/components/dashboard/works';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Types
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'web' | 'app';
  isLongImage: boolean;
  tech: string[];
  links: {
    live: string;
  }
}

const ManageWorks = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12; // 6 projects per row, 2 rows

  // Initial form state
  const emptyProject: Project = {
    id: 0,
    title: "",
    description: "",
    image: "",
    isLongImage: true,
    category: "web",
    tech: [],
    links: {
      live: ""
    }
  };

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching projects from Supabase...');
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Projects fetched successfully:', data);
        
        // If no data or empty array, just set empty projects
        if (!data || data.length === 0) {
          setProjects([]);
          return;
        }
        
        // Transform data from Supabase format to our app format
        const formattedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          image: item.image || '',
          category: item.category as 'web' | 'app',
          isLongImage: item.is_long_image || false,
          tech: item.tech || [],
          links: {
            live: item.live_url || ''
          }
        }));
        
        setProjects(formattedProjects);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(`Failed to load projects: ${err?.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Add or edit project
  const handleAddEdit = (project: Project | null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Delete project
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state after successful deletion
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  // Save project (create or update)
  const handleSave = async (savedProject: Project) => {
    try {
      // Convert from our app format to Supabase format
      const supabaseProject = {
        title: savedProject.title,
        description: savedProject.description,
        image: savedProject.image,
        category: savedProject.category,
        is_long_image: savedProject.isLongImage,
        tech: savedProject.tech,
        live_url: savedProject.links.live,
        updated_at: new Date().toISOString()
      };
      
      if (editingProject) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(supabaseProject)
          .eq('id', editingProject.id)
          .select()
          .single();
          
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Failed to update project: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('No data returned after update');
        }
        
        // Update local state
        setProjects(projects.map(p => p.id === editingProject.id ? 
          { ...savedProject, id: editingProject.id } : p));
      } else {
        // Add new project
        const { data, error } = await supabase
          .from('projects')
          .insert([{ ...supabaseProject, created_at: new Date().toISOString() }])
          .select()
          .single();
          
        if (error) {
          console.error('Supabase insert error:', error);
          throw new Error(`Failed to create project: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('No data returned after insert');
        }
        
        // Add the new project to local state with the ID from Supabase
        const newProject: Project = {
          ...savedProject,
          id: data.id
        };
        
        setProjects([newProject, ...projects]);
      }
      
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      console.error('Error saving project:', err);
      alert(`Failed to save project: ${err.message || 'Unknown error'}`);
    }
  };

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of projects section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">Projects</h2>
        <button 
          onClick={() => handleAddEdit(null)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900/40 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-4">No projects found</div>
          <button 
            onClick={() => handleAddEdit(null)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors duration-200"
          >
            <Plus size={18} className="mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200"
              >
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
                
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleAddEdit(project)}
                    className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-white hover:bg-slate-800'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
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
                    onClick={() => handlePageChange(idx + 1)}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                      currentPage === idx + 1
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-white hover:bg-slate-800'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
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

      {isModalOpen && (
        <ProjectForm
          project={editingProject}
          defaultProject={emptyProject}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default ManageWorks; 