import React from 'react';
import { Navigate } from 'react-router-dom';
import SignInForm from '../../components/auth/SignInForm';
import useAuthStore from '../../store/authStore';

const SignInPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <SignInForm />
    </div>
  );
};

export default SignInPage;