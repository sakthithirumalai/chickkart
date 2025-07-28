import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/ui/CartStateManager';
import Header from '../../components/ui/Header';
import CustomerFlowNavigator from '../../components/ui/CustomerFlowNavigator';
import OrderSummary from './components/OrderSummary';
import CustomerDetails from './components/CustomerDetails';
import UPIPaymentOptions from './components/UPIPaymentOptions';
import PaymentConfirmation from './components/PaymentConfirmation';
import OrderSuccess from './components/OrderSuccess';
import Icon from '../../components/AppIcon';


const UPIPaymentConfirmation = () => {
  const navigate = useNavigate();
  const { cartState, clearCart, setPaymentStatus } = useCart();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  // Mock customer data - in real app, this would come from previous step
  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem('chickKartCustomerInfo');
    if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    } else {
      // Mock customer data for demo
      setCustomerInfo({
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        notes: 'Medium spice level, extra sauce on the side'
      });
    }
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/customer-menu-browse');
    }
  }, [cartState.items.length, navigate]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const generateOrderId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `CK${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
  };

  const handleConfirmPayment = async (transactionId) => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      // Update payment status in cart
      setPaymentStatus('completed', newOrderId, selectedPaymentMethod);
      
      // Simulate order submission to backend
      const orderData = {
        orderId: newOrderId,
        items: cartState.items,
        total: cartState.total,
        customer: customerInfo,
        paymentMethod: selectedPaymentMethod,
        transactionId: transactionId || null,
        timestamp: new Date().toISOString(),
        status: 'received'
      };
      
      // In real app, this would be an API call
      console.log('Order submitted:', orderData);
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      setPaymentCompleted(true);
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePlaceNewOrder = () => {
    clearCart();
    navigate('/customer-menu-browse');
  };

  const handleViewOrderDetails = () => {
    setOrderSummaryExpanded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const estimatedPreparationTime = Math.ceil(cartState.items.length * 3 + Math.random() * 10 + 15); // 15-35 minutes

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CustomerFlowNavigator />
        
        <main className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <OrderSuccess
              orderId={orderId}
              estimatedTime={estimatedPreparationTime}
              onPlaceNewOrder={handlePlaceNewOrder}
              onViewOrderDetails={handleViewOrderDetails}
            />
            
            {orderSummaryExpanded && (
              <div className="mt-8">
                <OrderSummary
                  cartItems={cartState.items}
                  total={cartState.total}
                  isExpanded={true}
                  onToggleExpanded={() => setOrderSummaryExpanded(false)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CustomerFlowNavigator />
      
      <main className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground">
              Secure UPI payment for your ChickKart order
            </p>
          </div>

          {/* Order Summary */}
          <OrderSummary
            cartItems={cartState.items}
            total={cartState.total}
            isExpanded={orderSummaryExpanded}
            onToggleExpanded={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
          />

          {/* Customer Details */}
          <CustomerDetails customerInfo={customerInfo} />

          {/* UPI Payment Options */}
          <UPIPaymentOptions
            total={cartState.total}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
          />

          {/* Payment Confirmation */}
          <PaymentConfirmation
            selectedMethod={selectedPaymentMethod}
            onConfirmPayment={handleConfirmPayment}
            isProcessing={isProcessingPayment}
          />

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Shield" size={12} color="white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Secure Payment</p>
                <p className="text-muted-foreground text-xs">
                  Your payment is processed through India's secure UPI system. 
                  We never store your payment information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UPIPaymentConfirmation;