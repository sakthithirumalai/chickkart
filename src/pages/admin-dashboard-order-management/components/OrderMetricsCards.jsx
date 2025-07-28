import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderMetricsCards = ({ metrics }) => {
  const metricCards = [
    {
      title: "Today\'s Orders",
      value: metrics.totalOrders,
      icon: "ShoppingBag",
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Pending Orders",
      value: metrics.pendingOrders,
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10",
      change: "3 urgent",
      changeType: "neutral"
    },
    {
      title: "Today\'s Revenue",
      value: `₹${metrics.revenue.toLocaleString()}`,
      icon: "TrendingUp",
      color: "text-success",
      bgColor: "bg-success/10",
      change: "+8.5%",
      changeType: "positive"
    },
    {
      title: "Avg Order Value",
      value: `₹${metrics.avgOrderValue}`,
      icon: "Calculator",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+₹25",
      changeType: "positive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className={card.color} />
            </div>
            <div className={`text-sm font-medium ${
              card.changeType === 'positive' ? 'text-success' : 
              card.changeType === 'negative' ? 'text-error' : 'text-muted-foreground'
            }`}>
              {card.change}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{card.value}</h3>
            <p className="text-sm text-muted-foreground">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMetricsCards;