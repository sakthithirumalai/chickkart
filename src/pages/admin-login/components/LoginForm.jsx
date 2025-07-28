import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.username === mockCredentials.username && 
          formData.password === mockCredentials.password) {
        
        // Set authentication token
        const authToken = `chickKart_admin_${Date.now()}`;
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        
        localStorage.setItem('chickKartAdminAuth', authToken);
        localStorage.setItem('chickKartAdminAuthExpiry', expiryTime.toString());
        
        if (formData.rememberMe) {
          localStorage.setItem('chickKartRememberAdmin', 'true');
        }
        
        navigate('/admin-dashboard-order-management');
      } else {
        setErrors({
          general: 'Invalid username or password. Please check your credentials and try again.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Please contact your system administrator for password reset assistance.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-food-modal p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={28} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">ChickKart</h1>
          <p className="text-muted-foreground">Staff Portal Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign In</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Access your admin dashboard to manage orders and operations
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-error/10 border border-error/20 rounded-md p-3 flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          {/* Username Field */}
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            error={errors.username}
            required
            disabled={isLoading}
          />

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors.password}
            required
            disabled={isLoading}
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors hover-lift"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={!formData.username || !formData.password}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Demo Credentials */}
          <div className="bg-muted/50 rounded-md p-4 border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Demo Credentials</p>
            </div>
            <div className="space-y-1 text-xs font-mono">
              <p className="text-foreground">Username: <span className="text-primary">admin</span></p>
              <p className="text-foreground">Password: <span className="text-primary">admin123</span></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;