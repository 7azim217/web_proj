import React from 'react';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '../../types';
import Card from '../ui/Card';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Calculate colors based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return 'bg-blue-500 border-blue-600';
      case 'mobile development':
        return 'bg-amber-500 border-amber-600';
      case 'data science':
        return 'bg-emerald-500 border-emerald-600';
      case 'machine learning':
        return 'bg-purple-500 border-purple-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const categoryColor = getCategoryColor(project.category);
  const formattedStartDate = format(new Date(project.startDate), 'yyyy-MM-dd');
  const formattedEndDate = format(new Date(project.endDate), 'yyyy-MM-dd');
  
  return (
    <Card 
      variant="bordered" 
      className="transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {project.category}
          </span>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center mb-3 text-gray-400">
          <UserIcon size={16} className="mr-1" />
          <span className="text-sm">
            {project.students.join(', ')}
          </span>
        </div>
        
        <div className="flex items-center mb-4 text-gray-400">
          <CalendarIcon size={16} className="mr-1" />
          <span className="text-sm">
            {formattedStartDate} - {formattedEndDate}
          </span>
        </div>
        
        <div className="mb-1 flex justify-between">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-blue-400">{project.progress}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;