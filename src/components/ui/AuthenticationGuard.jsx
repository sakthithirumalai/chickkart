import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const AuthenticationGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const adminRoutes = ['/admin-dashboard-order-management'];
  const isAdminRoute = adminRoutes.includes(location.pathname);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authToken = localStorage.getItem('chickKartAdminAuth');
    const authExpiry = localStorage.getItem('chickKartAdminAuthExpiry');
    
    if (authToken && authExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(authExpiry)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('chickKartAdminAuth');
        localStorage.removeItem('chickKartAdminAuthExpiry');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials
      if (loginData.username === 'admin' && loginData.password === 'admin123') {
        const authToken = 'demo-auth-token-' + Date.now();
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        
        localStorage.setItem('chickKartAdminAuth', authToken);
        localStorage.setItem('chickKartAdminAuthExpiry', expiryTime.toString());
        
        setIsAuthenticated(true);
        navigate('/admin-dashboard-order-management');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chickKartAdminAuth');
    localStorage.removeItem('chickKartAdminAuthExpiry');
    setIsAuthenticated(false);
    navigate('/admin-login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="animate-pulse-subtle">
            <Icon name="Loader2" size={24} className="animate-spin" />
          </div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show login form for admin routes when not authenticated
  if (isAdminRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-food-modal p-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="ChefHat" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">ChickKart</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Sign In</h2>
                <p className="text-sm text-muted-foreground">
                  Access your admin dashboard to manage orders
                </p>
              </div>

              <Input
                label="Username"
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                disabled={isLoggingIn}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoggingIn}
                error={loginError}
              />

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isLoggingIn}
                disabled={!loginData.username || !loginData.password}
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Demo Credentials */}
              <div className="bg-muted/50 rounded-md p-3 text-sm">
                <p className="text-muted-foreground mb-1">Demo Credentials:</p>
                <p className="font-mono text-xs">Username: admin</p>
                <p className="font-mono text-xs">Password: admin123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Provide logout function to authenticated admin components
  if (isAdminRoute && isAuthenticated) {
    return React.cloneElement(children, { onLogout: handleLogout });
  }

  return children;
};

export default AuthenticationGuard;