import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const spiceLevelOptions = [
    { value: 'mild', label: 'Mild - Perfect for everyone' },
    { value: 'medium', label: 'Medium - Just right' },
    { value: 'hot', label: 'Hot - For spice lovers' },
    { value: 'extra-hot', label: 'Extra Hot - Only for the brave!' }
  ];

  const availableAddons = [
    { id: 'extra-cheese', name: 'Extra Cheese', price: 25 },
    { id: 'extra-sauce', name: 'Extra Sauce', price: 15 },
    { id: 'extra-spicy', name: 'Make it Extra Spicy', price: 0 },
    { id: 'no-onion', name: 'No Onion', price: 0 }
  ];

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotalPrice = () => {
    const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return (product.price + addonPrice) * quantity;
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddToCart({
      ...product,
      quantity,
      customizations: {
        spiceLevel,
        addons: selectedAddons
      },
      price: calculateTotalPrice() / quantity
    });
    
    setIsAdding(false);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-food-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-64 overflow-hidden rounded-t-lg">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
          {product.isVeg && (
            <div className="absolute top-4 left-4 w-6 h-6 bg-success rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-success-foreground rounded-full"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-muted-foreground mb-3">{product.description}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} className="text-accent fill-current" />
                <span className="font-medium text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span className="text-sm">15-20 mins</span>
              </div>
            </div>
          </div>

          {/* Spice Level */}
          <div className="mb-6">
            <Select
              label="Spice Level"
              options={spiceLevelOptions}
              value={spiceLevel}
              onChange={setSpiceLevel}
              className="mb-4"
            />
          </div>

          {/* Add-ons */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Customize Your Order</h3>
            <div className="space-y-2">
              {availableAddons.map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.some(a => a.id === addon.id)}
                      onChange={() => handleAddonToggle(addon)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-foreground">{addon.name}</span>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">
                    {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-foreground">Quantity:</span>
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                  disabled={quantity <= 1}
                >
                  <Icon name="Minus" size={16} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                >
                  <Icon name="Plus" size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground font-mono">
                ₹{calculateTotalPrice().toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                ₹{(calculateTotalPrice() / quantity).toFixed(2)} each
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="default"
            fullWidth
            onClick={handleAddToCart}
            loading={isAdding}
            iconName="ShoppingCart"
            iconPosition="left"
            className="scale-feedback"
          >
            {isAdding ? 'Adding to Cart...' : `Add ${quantity} to Cart - ₹${calculateTotalPrice().toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;