import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCartState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Empty Cart Illustration */}
        <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
          <Icon name="ShoppingCart" size={40} className="text-muted-foreground" />
        </div>

        {/* Empty State Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your cart is empty</h2>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            Looks like you haven't added any delicious items to your cart yet. 
            Browse our menu to discover amazing chicken dishes, sandwiches, and refreshing beverages!
          </p>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button
              variant="default"
              fullWidth
              onClick={() => navigate('/customer-menu-browse')}
              iconName="Menu"
              iconPosition="left"
              className="scale-feedback"
            >
              Browse Menu
            </Button>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>Quick ordering</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Smartphone" size={14} />
                <span>UPI payments</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Truck" size={14} />
                <span>Fast delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Items Suggestion */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Popular Today</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Chicken Wings • Grilled Sandwich • Fresh Juice Combos
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartState;