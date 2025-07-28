import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './components/LoginForm';
import BackgroundPattern from './components/BackgroundPattern';
import BrandingHeader from './components/BrandingHeader';
import SecurityFeatures from './components/SecurityFeatures';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setLoginError('');
      clearError();

      const result = await signIn(credentials.email, credentials.password);
      
      if (result?.success) {
        // Check if user has admin role
        // Note: This will be handled by the auth context and user profile
        navigate('/admin-dashboard-order-management');
      } else {
        setLoginError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const error = loginError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundPattern />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <BrandingHeader />
            
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Admin Access
                </h2>
                <p className="text-gray-600">
                  Sign in to access the admin dashboard
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
              />

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Demo Credentials:</p>
                <p className="font-mono bg-gray-50 p-2 rounded mt-2">
                  admin@chickkart.com / admin123
                </p>
              </div>
            </div>

            <SecurityFeatures />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;