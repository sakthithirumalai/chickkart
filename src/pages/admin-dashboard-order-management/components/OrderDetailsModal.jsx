import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';

const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-food-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{formatTime(order.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Payment:</span>
                  <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Order Items</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.customizations.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-mono font-medium text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                <span className="font-medium text-foreground">Total Amount</span>
                <span className="text-lg font-bold font-mono text-foreground">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          {order.notes && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Special Notes</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-foreground">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={order.status === status.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusUpdate(order.id, status.value)}
                  disabled={order.status === status.value}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="default"
            onClick={() => window.print()}
            iconName="Printer"
            iconPosition="left"
          >
            Print Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;