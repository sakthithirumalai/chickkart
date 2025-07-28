import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import OrderDetailsModal from './OrderDetailsModal';

const OrdersTable = ({ orders, onStatusUpdate, onBulkAction }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === 'timestamp') {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
    }
    
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
    
    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdateFromModal = (orderId, newStatus) => {
    onStatusUpdate(orderId, newStatus);
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="ShoppingBag" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Orders Found</h3>
        <p className="text-muted-foreground">Orders will appear here when customers place them.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-primary/5 border-b border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Select
                  placeholder="Bulk update status"
                  options={statusOptions}
                  value=""
                  onChange={(status) => {
                    onBulkAction(selectedOrders, 'updateStatus', status);
                    setSelectedOrders([]);
                  }}
                  className="w-48"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Order ID
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('customerName')}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Customer
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">Items</th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('total')}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Total
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">Payment</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Time
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-medium text-primary">#{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-foreground">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                      <div className="text-muted-foreground truncate max-w-32">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-medium text-foreground">₹{order.total.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
                  </td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{formatTime(order.timestamp)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                        iconName="Eye"
                        iconPosition="left"
                      >
                        View
                      </Button>
                      <Select
                        placeholder="Update"
                        options={statusOptions}
                        value={order.status}
                        onChange={(newStatus) => onStatusUpdate(order.id, newStatus)}
                        className="w-32"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {sortedOrders.map((order) => (
            <div key={order.id} className="bg-muted/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="font-mono font-medium text-primary">#{order.id}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="ShoppingBag" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{order.items.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">{formatTime(order.timestamp)}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <PaymentStatusBadge status={order.paymentStatus} method={order.paymentMethod} />
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openOrderDetails(order)}
                    iconName="Eye"
                  />
                  <Select
                    placeholder="Update"
                    options={statusOptions}
                    value={order.status}
                    onChange={(newStatus) => onStatusUpdate(order.id, newStatus)}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={handleStatusUpdateFromModal}
      />
    </>
  );
};

export default OrdersTable;