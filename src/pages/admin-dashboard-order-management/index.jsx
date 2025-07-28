import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import OrderMetricsCards from './components/OrderMetricsCards';
import OrderFilters from './components/OrderFilters';
import OrdersTable from './components/OrdersTable';
import LiveOrderNotifications from './components/LiveOrderNotifications';

const AdminDashboardOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [newOrderNotifications, setNewOrderNotifications] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock orders data
  const mockOrders = [
    {
      id: "CK001",
      customerName: "Rajesh Kumar",
      phone: "+91 98765 43210",
      items: [
        { name: "Spicy Chicken Wings", quantity: 2, price: 180, customizations: ["Extra Spicy", "No Onions"] },
        { name: "Chicken Sandwich", quantity: 1, price: 120, customizations: [] }
      ],
      total: 480,
      paymentStatus: "paid",
      paymentMethod: "UPI",
      status: "new",
      timestamp: new Date(Date.now() - 300000),
      notes: "Please make it extra spicy and pack separately"
    },
    {
      id: "CK002",
      customerName: "Priya Sharma",
      phone: "+91 87654 32109",
      items: [
        { name: "Grilled Chicken Combo", quantity: 1, price: 250, customizations: ["Medium Spice"] },
        { name: "Fresh Orange Juice", quantity: 2, price: 60, customizations: [] }
      ],
      total: 370,
      paymentStatus: "paid",
      paymentMethod: "GPay",
      status: "preparing",
      timestamp: new Date(Date.now() - 900000),
      notes: ""
    },
    {
      id: "CK003",
      customerName: "Amit Patel",
      phone: "+91 76543 21098",
      items: [
        { name: "BBQ Chicken Wings", quantity: 3, price: 180, customizations: ["Mild Spice"] },
        { name: "Chicken Burger", quantity: 2, price: 150, customizations: ["No Mayo"] }
      ],
      total: 840,
      paymentStatus: "pending",
      paymentMethod: "PhonePe",
      status: "new",
      timestamp: new Date(Date.now() - 600000),
      notes: "Call before delivery"
    },
    {
      id: "CK004",
      customerName: "Sneha Reddy",
      phone: "+91 65432 10987",
      items: [
        { name: "Chicken Tikka Sandwich", quantity: 1, price: 140, customizations: [] },
        { name: "Mango Juice", quantity: 1, price: 70, customizations: [] }
      ],
      total: 210,
      paymentStatus: "paid",
      paymentMethod: "UPI",
      status: "out-for-delivery",
      timestamp: new Date(Date.now() - 1800000),
      notes: ""
    },
    {
      id: "CK005",
      customerName: "Vikram Singh",
      phone: "+91 54321 09876",
      items: [
        { name: "Family Chicken Combo", quantity: 1, price: 450, customizations: ["Extra Spicy", "Extra Sauce"] }
      ],
      total: 450,
      paymentStatus: "paid",
      paymentMethod: "GPay",
      status: "delivered",
      timestamp: new Date(Date.now() - 3600000),
      notes: "Delivered to security gate"
    },
    {
      id: "CK006",
      customerName: "Anita Gupta",
      phone: "+91 43210 98765",
      items: [
        { name: "Honey Glazed Wings", quantity: 2, price: 200, customizations: [] },
        { name: "Chicken Caesar Wrap", quantity: 1, price: 160, customizations: ["No Cheese"] }
      ],
      total: 560,
      paymentStatus: "failed",
      paymentMethod: "UPI",
      status: "cancelled",
      timestamp: new Date(Date.now() - 7200000),
      notes: "Payment failed - customer cancelled"
    }
  ];

  // Calculate metrics
  const calculateMetrics = (ordersList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = ordersList.filter(order => {
      const orderDate = new Date(order.timestamp);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const pendingOrders = ordersList.filter(order => 
      ['new', 'preparing', 'out-for-delivery'].includes(order.status)
    );

    const paidOrders = todayOrders.filter(order => order.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    return {
      totalOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      revenue: totalRevenue,
      avgOrderValue: Math.round(avgOrderValue)
    };
  };

  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.phone.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.timestamp);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'this-week':
            return orderDate >= thisWeekStart;
          case 'this-month':
            return orderDate >= thisMonthStart;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Simulate real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new orders occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newOrder = {
          id: `CK${String(orders.length + Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          customerName: ["Rahul Verma", "Kavya Nair", "Arjun Mehta", "Divya Joshi"][Math.floor(Math.random() * 4)],
          phone: `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`,
          items: [
            { name: "Chicken Wings", quantity: Math.floor(Math.random() * 3) + 1, price: 180, customizations: [] }
          ],
          total: Math.floor(Math.random() * 500) + 100,
          paymentStatus: "paid",
          paymentMethod: ["UPI", "GPay", "PhonePe"][Math.floor(Math.random() * 3)],
          status: "new",
          timestamp: new Date(),
          notes: ""
        };

        setOrders(prev => [newOrder, ...prev]);
        setNewOrderNotifications([newOrder]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [orders.length]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleBulkAction = (orderIds, action, value) => {
    if (action === 'updateStatus') {
      setOrders(prev => prev.map(order =>
        orderIds.includes(order.id) ? { ...order, status: value } : order
      ));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLastRefresh(new Date());
    
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleViewOrderFromNotification = (orderId) => {
    // Scroll to order in table or open details modal
    const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
    if (orderElement) {
      orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const metrics = calculateMetrics(orders);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                <span className="text-muted-foreground">Loading dashboard...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Live Order Notifications */}
      <LiveOrderNotifications
        newOrders={newOrderNotifications}
        onDismiss={() => setNewOrderNotifications([])}
        onViewOrder={handleViewOrderFromNotification}
      />

      <div className="pt-16">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage all incoming orders in real-time
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <div className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                iconName="RefreshCw"
                iconPosition="left"
                loading={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <OrderMetricsCards metrics={metrics} />

          {/* Filters */}
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onRefresh={handleRefresh}
          />

          {/* Orders Table */}
          <OrdersTable
            orders={filteredOrders}
            onStatusUpdate={handleStatusUpdate}
            onBulkAction={handleBulkAction}
          />

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrderManagement;