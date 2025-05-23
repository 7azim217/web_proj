import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useDataStore from '../../store/dataStore';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProjectFormData>;
  onSubmit?: (data: Partial<ProjectFormData>) => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  students: string;
  startDate: string;
  endDate: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const { createProject } = useDataStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormData>();

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title || '');
      setValue('description', initialData.description || '');
      setValue('category', initialData.category || '');
      setValue('students', (initialData.students as string) || '');
      setValue('startDate', initialData.startDate || '');
      setValue('endDate', initialData.endDate || '');
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      setError(null);
      const studentArray = data.students
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (studentArray.length === 0) {
        setError('At least one student must be assigned to the project');
        return;
      }

      const projectPayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        students: studentArray,
        startDate: data.startDate,
        endDate: data.endDate,
        progress: initialData ? initialData.progress || 0 : 0
      };

      if (onSubmit) {
        await onSubmit(projectPayload);
      } else {
        await createProject(projectPayload);
      }

      reset();
      onClose();
    } catch (err) {
      setError('Failed to submit project. Please try again.');
      console.error('Error submitting project:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {initialData ? 'Edit Project' : 'Add New Project'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="Enter project title"
          />

          <Input
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            placeholder="Enter project description"
          />

          <Input
            label="Category"
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
            placeholder="e.g., Web Development, Mobile Development"
          />

          <Input
            label="Students (comma-separated usernames)"
            {...register('students', { required: 'At least one student is required' })}
            error={errors.students?.message}
            placeholder="e.g., student1, student2"
          />

          <Input
            label="Start Date"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            error={errors.startDate?.message}
          />

          <Input
            label="End Date"
            type="date"
            {...register('endDate', { required: 'End date is required' })}
            error={errors.endDate?.message}
          />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {initialData ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
