import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const OrderFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  dateFilter, 
  setDateFilter,
  onRefresh 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'new', label: 'New Orders' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            type="search"
            placeholder="Search by Order ID, Customer Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
          />
        </div>

        {/* Date Filter */}
        <div className="w-full lg:w-40">
          <Select
            label="Period"
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            className="w-full"
          />
        </div>

        {/* Refresh Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('today');
            }}
            title="Clear filters"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;