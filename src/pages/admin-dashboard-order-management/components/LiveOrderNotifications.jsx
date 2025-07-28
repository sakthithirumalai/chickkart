import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveOrderNotifications = ({ newOrders, onDismiss, onViewOrder }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (newOrders && newOrders.length > 0) {
      const newNotifications = newOrders.map(order => ({
        id: `notification-${order.id}`,
        orderId: order.id,
        customerName: order.customerName,
        total: order.total,
        timestamp: Date.now(),
        isVisible: true
      }));
      
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 5));
      
      // Auto-dismiss after 10 seconds
      newNotifications.forEach(notification => {
        setTimeout(() => {
          handleDismiss(notification.id);
        }, 10000);
      });
    }
  }, [newOrders]);

  const handleDismiss = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isVisible: false }
          : notification
      )
    );
    
    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (onDismiss) onDismiss(notificationId);
    }, 300);
  };

  const handleViewOrder = (orderId) => {
    if (onViewOrder) onViewOrder(orderId);
    // Dismiss the notification when viewed
    const notification = notifications.find(n => n.orderId === orderId);
    if (notification) {
      handleDismiss(notification.id);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-card border-l-4 border-l-primary rounded-lg shadow-food-modal p-4 transition-all duration-300 ${
            notification.isVisible 
              ? 'translate-x-0 opacity-100' :'translate-x-full opacity-0'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Bell" size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm">New Order!</h4>
                <p className="text-xs text-muted-foreground">
                  #{notification.orderId} from {notification.customerName}
                </p>
                <p className="text-xs font-mono font-medium text-primary">
                  ₹{notification.total.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(notification.id)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="default"
              size="xs"
              onClick={() => handleViewOrder(notification.orderId)}
              className="flex-1"
            >
              View Order
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleDismiss(notification.id)}
              className="flex-1"
            >
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveOrderNotifications;