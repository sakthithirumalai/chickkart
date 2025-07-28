import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BrandingHeader = () => {
  const navigate = useNavigate();

  const handleCustomerPortal = () => {
    navigate('/customer-menu-browse');
  };

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ChefHat" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ChickKart</h1>
                <p className="text-xs text-muted-foreground">Restaurant Management System</p>
              </div>
            </div>
            
            {/* Staff Portal Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
              <Icon name="Users" size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Staff Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCustomerPortal}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden sm:inline ml-2">Customer Portal</span>
            </Button>
            
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
              <span className="text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingHeader;