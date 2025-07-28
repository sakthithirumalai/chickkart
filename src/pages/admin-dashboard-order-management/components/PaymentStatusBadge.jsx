import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusBadge = ({ status, method }) => {
  const getPaymentConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          label: 'Paid',
          className: 'bg-success/10 text-success border-success/20',
          icon: 'CheckCircle'
        };
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-warning/10 text-warning border-warning/20',
          icon: 'Clock'
        };
      case 'failed':
        return {
          label: 'Failed',
          className: 'bg-error/10 text-error border-error/20',
          icon: 'XCircle'
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-muted/10 text-muted-foreground border-muted/20',
          icon: 'RotateCcw'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted/10 text-muted-foreground border-muted/20',
          icon: 'HelpCircle'
        };
    }
  };

  const config = getPaymentConfig(status);

  return (
    <div className="space-y-1">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon name={config.icon} size={12} />
        {config.label}
      </div>
      {method && (
        <div className="text-xs text-muted-foreground">
          via {method}
        </div>
      )}
    </div>
  );
};

export default PaymentStatusBadge;