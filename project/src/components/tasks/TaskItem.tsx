import React from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, Clock, AlertCircleIcon } from 'lucide-react';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case 'in_progress':
        return <Clock size={20} className="text-amber-500" />;
      case 'pending':
        return <AlertCircleIcon size={20} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'bg-green-900/20 text-green-400 border-green-500';
      case 'in_progress': return 'bg-amber-900/20 text-amber-400 border-amber-500';
      case 'pending': return 'bg-gray-800 text-gray-400 border-gray-600';
      default: return '';
    }
  };

  let formattedDueDate = 'Invalid date';
  if (task.dueDate && !isNaN(Date.parse(task.dueDate))) {
    formattedDueDate = format(new Date(task.dueDate), 'MMM d, yyyy');
  }

  return (
    <div className={`border-l-4 ${getStatusColor()} bg-gray-900 p-4 rounded-r-md mb-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-medium mb-1">{task.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{task.description}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-400 mr-4">Assigned to: {task.assignedTo}</span>
            <span className="text-gray-400">Due: {formattedDueDate}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center mb-2">
            {getStatusIcon()}
            <span className="ml-1 text-sm">{getStatusText()}</span>
          </div>

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="mt-2 bg-gray-800 border border-gray-700 text-white rounded-md px-2 py-1 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;