import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItemCard = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-food-card">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2">
                {item.name}
              </h3>
              
              {/* Customizations */}
              {item.customizations && item.customizations.length > 0 && (
                <div className="mt-1">
                  {item.customizations.map((customization, index) => (
                    <span key={index} className="text-xs text-muted-foreground">
                      {customization}
                      {index < item.customizations.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono font-semibold text-primary text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ₹{item.price.toFixed(2)} each
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="text-muted-foreground hover:text-error ml-2 flex-shrink-0"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="w-8 h-8 text-muted-foreground hover:text-foreground scale-feedback"
              >
                <Icon name="Minus" size={14} />
              </Button>
              
              <span className="font-mono font-medium text-foreground min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="w-8 h-8 text-muted-foreground hover:text-foreground scale-feedback"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;