import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingCartSummary = ({ cartSummary, isVisible }) => {
  const navigate = useNavigate();

  if (!isVisible || cartSummary.isEmpty) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <div className="bg-card border border-border rounded-lg shadow-food-modal p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="ShoppingCart" size={18} className="text-primary" />
            <span className="font-medium text-foreground">
              {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="text-xl font-bold text-foreground font-mono">
            ₹{cartSummary.total.toFixed(2)}
          </div>
        </div>
        
        <Button
          variant="default"
          fullWidth
          onClick={() => navigate('/shopping-cart-checkout')}
          iconName="ArrowRight"
          iconPosition="right"
          className="scale-feedback"
        >
          View Cart & Checkout
        </Button>
      </div>
    </div>
  );
};

export default FloatingCartSummary;