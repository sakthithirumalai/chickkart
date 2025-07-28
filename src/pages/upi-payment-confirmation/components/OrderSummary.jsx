import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderSummary = ({ cartItems, total, isExpanded, onToggleExpanded }) => {
  return (
    <div className="bg-card rounded-lg shadow-food-card border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
        <button
          onClick={onToggleExpanded}
          className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
        >
          <span className="text-sm font-medium">
            {isExpanded ? 'Hide Details' : 'View Details'}
          </span>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
          />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 mb-4 border-t border-border pt-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-mono font-medium text-foreground">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-base font-semibold text-foreground">Total Amount</span>
        <span className="text-xl font-bold font-mono text-primary">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;