import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
  isStudent: boolean;
  universityId?: string;
}

const SignUpForm: React.FC = () => {
  const { signup, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      isStudent: false,
    }
  });
  
  const password = watch('password');
  const isStudent = watch('isStudent');
  
  const onSubmit = async (data: SignUpFormData) => {
    try {
      const role: UserRole = data.isStudent ? 'student' : 'admin';
      await signup(
        data.username, 
        data.password, 
        role,
        data.isStudent ? data.universityId : undefined
      );
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Sign Up</h1>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded-md mb-4 flex justify-between items-center">
          <p>{error}</p>
          <button 
            onClick={clearError}
            className="text-white hover:text-red-200"
          >
            ✕
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Username"
          fullWidth
          {...register('username', { 
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            }
          })}
          error={errors.username?.message}
          placeholder="Choose a username"
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password?.message}
            placeholder="Create a password"
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
          error={errors.confirmPassword?.message}
          placeholder="Confirm your password"
        />
        
        <Checkbox
          label="I am a student"
          {...register('isStudent')}
        />
        
        {isStudent && (
          <Input
            label="University ID"
            fullWidth
            {...register('universityId', { 
              required: isStudent ? 'University ID is required for students' : false 
            })}
            error={errors.universityId?.message}
            placeholder="Enter your university ID"
          />
        )}
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-400"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;