import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useDataStore from '../../store/dataStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: any | null; // Replace "any" with your Task type if available
}

interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  projectId: string;
  dueDate: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { createTask, updateTask, fetchProjects, projects } = useDataStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: taskToEdit || {}
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (taskToEdit) {
      reset(taskToEdit);
    } else {
      reset();
    }
  }, [taskToEdit, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setError(null);
      if (taskToEdit) {
        await updateTask(taskToEdit.id, data);
      } else {
        await createTask({ ...data, status: 'pending' });
      }
      reset();
      onClose();
    } catch (err) {
      console.error('Error submitting task:', err);
      setError('Something went wrong while submitting the task.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {taskToEdit ? 'Edit Task' : 'Add New Task'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="Enter task title"
          />

          <Input
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            placeholder="Enter task description"
          />

          <Input
            label="Assign to (User ID)"
            {...register('assignedTo', { required: 'Assignee is required' })}
            error={errors.assignedTo?.message}
            placeholder="e.g., user id"
          />

          <div>
            <label className="block text-white font-medium mb-1">Select Project</label>
            <select
              {...register('projectId', { required: 'Project is required' })}
              className="w-full bg-gray-700 text-white p-2 rounded-md"
            >
              <option value="">-- Choose a project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-sm text-red-500 mt-1">{errors.projectId.message}</p>
            )}
          </div>

          <Input
            label="Due Date"
            type="date"
            {...register('dueDate', { required: 'Due date is required' })}
            error={errors.dueDate?.message}
          />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {taskToEdit ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
