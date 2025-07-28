import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSuccess = ({ orderId, estimatedTime, onPlaceNewOrder, onViewOrderDetails }) => {
  const currentTime = new Date();
  const estimatedDeliveryTime = new Date(currentTime.getTime() + (estimatedTime * 60000));
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Animation */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center animate-pulse-subtle">
          <Icon name="CheckCircle" size={40} color="white" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Order Placed Successfully! 🎉
        </h2>
        <p className="text-muted-foreground">
          Thank you for your order. We're preparing your delicious meal!
        </p>
      </div>

      {/* Order ID */}
      <div className="bg-card rounded-lg shadow-food-card border border-border p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Receipt" size={20} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Order ID</span>
          </div>
          <div className="text-3xl font-bold font-mono text-primary">
            #{orderId}
          </div>
          <p className="text-xs text-muted-foreground">
            Please save this order ID for your reference
          </p>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="bg-primary/10 rounded-lg border border-primary/20 p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Clock" size={18} className="text-primary" />
          <span className="text-sm font-medium text-primary">Estimated Preparation Time</span>
        </div>
        <div className="text-lg font-semibold text-foreground">
          {estimatedTime} minutes
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Ready by approximately {formatTime(estimatedDeliveryTime)}
        </p>
      </div>

      {/* Order Status */}
      <div className="bg-warning/10 rounded-lg border border-warning/20 p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="ChefHat" size={18} className="text-warning" />
          <span className="text-sm font-medium text-warning">Current Status</span>
        </div>
        <div className="text-base font-semibold text-foreground">
          Order Received - Kitchen Preparing
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your order has been sent to our kitchen team
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          variant="outline"
          fullWidth
          onClick={onViewOrderDetails}
          className="h-12"
        >
          <Icon name="Eye" size={18} className="mr-2" />
          View Order Details
        </Button>
        
        <Button
          variant="default"
          fullWidth
          onClick={onPlaceNewOrder}
          className="h-12"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Place Another Order
        </Button>
      </div>

      {/* Contact Info */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">
          Need help with your order?
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <Icon name="Phone" size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">WhatsApp Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;