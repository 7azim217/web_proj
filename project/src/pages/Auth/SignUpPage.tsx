import React from 'react';
import { Navigate } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import useAuthStore from '../../store/authStore';

const SignUpPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;