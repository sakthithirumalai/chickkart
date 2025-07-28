import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onAddToCart({ ...product, quantity });
    setIsAdding(false);
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="bg-card rounded-lg shadow-food-card overflow-hidden hover-lift transition-all duration-200 border border-border">
      {/* Product Image with optimization */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
        <Image
          src={product.image}
          webpSrc={product.image} // Already using WebP from Supabase
          thumbnailSrc={product.thumbnailImage}
          alt={product.name}
          className="w-full h-full object-cover"
          lazy={true}
        />
        {product.isPopular && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            <Icon name="TrendingUp" size={12} className="inline mr-1" />
            Popular
          </div>
        )}
        {product.isVeg && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-success rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-success-foreground rounded-full"></div>
          </div>
        )}
        {product.preparationTime && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
            <Icon name="Clock" size={10} className="mr-1" />
            {product.preparationTime}min
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {product.calories && (
              <span className="flex items-center">
                <Icon name="Zap" size={10} className="mr-1" />
                {product.calories} cal
              </span>
            )}
            {product.categoryName && (
              <span className="bg-muted px-2 py-1 rounded">
                {product.categoryName}
              </span>
            )}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-accent fill-current" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground font-mono">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground line-through font-mono">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                  Save ₹{(product.originalPrice - product.price).toFixed(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                disabled={quantity <= 1}
              >
                <Icon name="Minus" size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
              >
                <Icon name="Plus" size={14} />
              </button>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              loading={isAdding}
              iconName="ShoppingCart"
              iconSize={16}
              className="scale-feedback"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Allergens/Dietary Info */}
        {(product.allergens?.length > 0 || product.isVeg) && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {product.isVeg && (
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                  Vegetarian
                </span>
              )}
              {product.allergens?.slice(0, 2).map((allergen, index) => (
                <span key={index} className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                  Contains {allergen}
                </span>
              ))}
              {product.allergens?.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{product.allergens.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;