import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isCustomerDomain = ['/customer-menu-browse', '/shopping-cart-checkout', '/upi-payment-confirmation'].includes(location.pathname);
  const isAdminDomain = ['/admin-login', '/admin-dashboard-order-management'].includes(location.pathname);

  const customerNavItems = [
    { label: 'Menu', path: '/customer-menu-browse', icon: 'Menu' },
    { label: 'Cart', path: '/shopping-cart-checkout', icon: 'ShoppingCart' },
    { label: 'Orders', path: '/upi-payment-confirmation', icon: 'Receipt' }
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin-dashboard-order-management', icon: 'LayoutDashboard' },
    { label: 'Orders', path: '/admin-dashboard-order-management', icon: 'ClipboardList' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="ChefHat" size={20} color="white" />
      </div>
      <span className="text-xl font-bold text-foreground">ChickKart</span>
    </div>
  );

  if (isCustomerDomain) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {customerNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover-lift ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Cart Summary */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="ShoppingCart" size={16} />
                <span>₹0</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <nav className="px-2 pt-2 pb-3 space-y-1">
                {customerNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  if (isAdminDomain && location.pathname !== '/admin-login') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Logo />
              
              {/* Admin Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover-lift ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Admin Tools */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Live Orders</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin-login')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="LogOut" size={16} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
              <nav className="px-2 pt-2 pb-3 space-y-1">
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <button
                    onClick={() => navigate('/admin-login')}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  return null;
};

export default Header;