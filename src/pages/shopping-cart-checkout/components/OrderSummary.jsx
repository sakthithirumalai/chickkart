import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ cartSummary, deliveryFee = 0, platformFee = 5 }) => {
  const subtotal = cartSummary.total;
  const totalCharges = deliveryFee + platformFee;
  const grandTotal = subtotal + totalCharges;

  const summaryItems = [
    { label: 'Subtotal', value: subtotal, isSubtotal: true },
    ...(deliveryFee > 0 ? [{ label: 'Delivery Fee', value: deliveryFee }] : []),
    { label: 'Platform Fee', value: platformFee },
    { label: 'Total', value: grandTotal, isTotal: true }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-food-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Receipt" size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Order Summary</h3>
      </div>

      <div className="space-y-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              item.isTotal 
                ? 'pt-3 border-t border-border font-semibold text-lg' 
                : item.isSubtotal 
                ? 'font-medium' :'text-sm text-muted-foreground'
            }`}
          >
            <span>{item.label}</span>
            <span className={`font-mono ${
              item.isTotal 
                ? 'text-primary text-xl' 
                : item.isSubtotal 
                ? 'text-foreground' 
                : 'text-muted-foreground'
            }`}>
              ₹{item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Item Count */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="ShoppingBag" size={16} />
          <span>{cartSummary.itemCount} item{cartSummary.itemCount !== 1 ? 's' : ''} in cart</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;