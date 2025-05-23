import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from 'lucide-react';
import ProjectCard from '../../components/projects/ProjectCard';
import AddProjectModal from '../../components/projects/AddProjectModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FileSubmitButton from '../../components/ui/FileSubmitButton';
import useDataStore from '../../store/dataStore';
import useAuthStore from '../../store/authStore';

interface EditProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  start_date: string;
  end_date: string;
}

const ProjectsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    projects,
    fetchProjects,
    deleteProject,
    updateProject
  } = useDataStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<EditProjectData | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All Statuses' ||
      (selectedStatus === 'Completed' && project.progress === 100) ||
      (selectedStatus === 'In Progress' && project.progress < 100 && project.progress > 0) ||
      (selectedStatus === 'Not Started' && project.progress === 0);

    return matchesSearch && matchesStatus;
  });

  const handleEditSubmit = async (updatedData: Partial<EditProjectData>) => {
    if (editProject) {
      await updateProject(editProject.id, updatedData);
      setEditProject(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500">Projects Overview</h1>

        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon size={16} className="mr-1" />
            Add New Project
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} variant="bordered" className="p-4">
              <ProjectCard project={project} />

              {user?.role === 'student' && (
                <FileSubmitButton itemId={project.id} type="project" />
              )}

              {user?.role === 'admin' && (
                <div className="flex justify-end mt-3 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditProject(project)}
                  >
                    <PencilIcon size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                  >
                    <TrashIcon size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="bordered" className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Projects Found</h3>
          <p className="text-gray-400">
            {searchTerm
              ? `No projects match "${searchTerm}"`
              : 'There are no projects available.'}
          </p>
        </Card>
      )}

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editProject && (
        <AddProjectModal
          isOpen={true}
          onClose={() => setEditProject(null)}
          initialData={editProject}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
