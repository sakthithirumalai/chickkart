import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CustomerFlowNavigator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const flowSteps = [
    { path: '/customer-menu-browse', label: 'Browse Menu', icon: 'Menu' },
    { path: '/shopping-cart-checkout', label: 'Cart & Checkout', icon: 'ShoppingCart' },
    { path: '/upi-payment-confirmation', label: 'Payment', icon: 'CreditCard' }
  ];

  const currentStepIndex = flowSteps.findIndex(step => step.path === location.pathname);
  const isCustomerFlow = currentStepIndex !== -1;

  useEffect(() => {
    const savedCart = localStorage.getItem('chickKartCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart.items?.length || 0);
      setCartTotal(cart.total || 0);
    }
  }, [location.pathname]);

  const handleStepNavigation = (stepIndex) => {
    if (stepIndex <= currentStepIndex) {
      navigate(flowSteps[stepIndex].path);
    }
  };

  const handleBackNavigation = () => {
    if (currentStepIndex > 0) {
      navigate(flowSteps[currentStepIndex - 1].path);
    }
  };

  if (!isCustomerFlow) return null;

  return (
    <>
      {/* Progress Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Back Button */}
            <div className="flex items-center">
              {currentStepIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="mr-4 hover-lift"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span className="ml-2 hidden sm:inline">Back</span>
                </Button>
              )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {flowSteps.map((step, index) => (
                <div key={step.path} className="flex items-center">
                  <button
                    onClick={() => handleStepNavigation(index)}
                    disabled={index > currentStepIndex}
                    className={`flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all hover-lift ${
                      index === currentStepIndex
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : index < currentStepIndex
                        ? 'text-success bg-success/10 cursor-pointer hover:bg-success/20' :'text-muted-foreground bg-muted cursor-not-allowed'
                    }`}
                  >
                    <Icon 
                      name={index < currentStepIndex ? 'Check' : step.icon} 
                      size={14} 
                    />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < flowSteps.length - 1 && (
                    <Icon 
                      name="ChevronRight" 
                      size={14} 
                      className="mx-1 sm:mx-2 text-muted-foreground" 
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="flex items-center">
              {cartItems > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Icon name="ShoppingCart" size={16} />
                    <span className="hidden sm:inline">{cartItems} items</span>
                  </div>
                  <div className="font-mono font-medium text-foreground">
                    ₹{cartTotal.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Summary (Mobile) */}
      {cartItems > 0 && location.pathname === '/customer-menu-browse' && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
          <Button
            variant="default"
            fullWidth
            onClick={() => navigate('/shopping-cart-checkout')}
            className="shadow-food-modal scale-feedback"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Icon name="ShoppingCart" size={18} />
                <span>{cartItems} items</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-medium">₹{cartTotal.toFixed(2)}</span>
                <Icon name="ArrowRight" size={16} />
              </div>
            </div>
          </Button>
        </div>
      )}
    </>
  );
};

export default CustomerFlowNavigator;