import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import useAuthStore from '../../store/authStore';

interface SignInFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const SignInForm: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    }
  });
  
  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data.username, data.password, data.rememberMe);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  
  return (
    <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Sign In</h1>
      
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
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          fullWidth
          {...register('username', { 
            required: 'Username is required' 
          })}
          error={errors.username?.message}
          placeholder="Enter your username"
          autoComplete="username"
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password', { 
              required: 'Password is required'
            })}
            error={errors.password?.message}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <Checkbox
          label="Stay Signed In"
          {...register('rememberMe')}
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>
        
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-500 hover:text-blue-400"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;