import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return {
          label: 'New',
          className: 'bg-primary/10 text-primary border-primary/20',
          dotColor: 'bg-primary'
        };
      case 'preparing':
        return {
          label: 'Preparing',
          className: 'bg-warning/10 text-warning border-warning/20',
          dotColor: 'bg-warning'
        };
      case 'out-for-delivery':
        return {
          label: 'Out for Delivery',
          className: 'bg-secondary/10 text-secondary border-secondary/20',
          dotColor: 'bg-secondary'
        };
      case 'delivered':
        return {
          label: 'Delivered',
          className: 'bg-success/10 text-success border-success/20',
          dotColor: 'bg-success'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-error/10 text-error border-error/20',
          dotColor: 'bg-error'
        };
      default:
        return {
          label: status,
          className: 'bg-muted/10 text-muted-foreground border-muted/20',
          dotColor: 'bg-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </div>
  );
};

export default OrderStatusBadge;