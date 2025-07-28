import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/ui/CartStateManager';
import Header from '../../components/ui/Header';
import CustomerFlowNavigator from '../../components/ui/CustomerFlowNavigator';
import CartItemCard from './components/CartItemCard';
import OrderSummary from './components/OrderSummary';
import CustomerInfoForm from './components/CustomerInfoForm';
import EmptyCartState from './components/EmptyCartState';
import CheckoutActions from './components/CheckoutActions';
import Icon from '../../components/AppIcon';

const ShoppingCartCheckout = () => {
  const navigate = useNavigate();
  const { cartState, updateQuantity, removeFromCart, getCartSummary } = useCart();
  const cartSummary = getCartSummary();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    spiceLevel: '',
    specialNotes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved customer info from localStorage
  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem('chickKartCustomerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedInfo = JSON.parse(savedCustomerInfo);
        setCustomerInfo(parsedInfo);
      } catch (error) {
        console.error('Error loading customer info:', error);
      }
    }
  }, []);

  // Save customer info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chickKartCustomerInfo', JSON.stringify(customerInfo));
  }, [customerInfo]);

  // Validate customer information
  const validateCustomerInfo = () => {
    const errors = {};

    if (!customerInfo.name || customerInfo.name.trim().length < 2) {
      errors.name = 'Please enter a valid name (minimum 2 characters)';
    }

    if (!customerInfo.phone || !/^[6-9]\d{9}$/.test(customerInfo.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomerInfoChange = (newInfo) => {
    setCustomerInfo(newInfo);
    // Clear validation errors when user starts typing
    if (validationErrors.name && newInfo.name) {
      setValidationErrors(prev => ({ ...prev, name: undefined }));
    }
    if (validationErrors.phone && newInfo.phone) {
      setValidationErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate order ID
      const orderId = `CK${Date.now().toString().slice(-6)}`;
      
      // Save order data for payment screen
      const orderData = {
        orderId,
        items: cartState.items,
        customerInfo,
        summary: {
          subtotal: cartSummary.total,
          deliveryFee: 0,
          platformFee: 5,
          total: cartSummary.total + 5
        },
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('chickKartCurrentOrder', JSON.stringify(orderData));
      
      // Navigate to payment screen
      navigate('/upi-payment-confirmation');
    } catch (error) {
      console.error('Error processing checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityUpdate = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Show empty cart state if no items
  if (cartSummary.isEmpty) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <CustomerFlowNavigator />
        <main className="pt-16">
          <EmptyCartState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CustomerFlowNavigator />
      
      <main className="pt-16 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="ShoppingCart" size={18} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your Order</h1>
                <p className="text-sm text-muted-foreground">
                  Review items and complete checkout
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items & Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="Package" size={18} />
                  <span>Order Items ({cartSummary.itemCount})</span>
                </h2>
                
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleQuantityUpdate}
                      onRemoveItem={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>

              {/* Customer Information Form */}
              <CustomerInfoForm
                customerInfo={customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                errors={validationErrors}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  cartSummary={cartSummary}
                  deliveryFee={0}
                  platformFee={5}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Actions */}
      <CheckoutActions
        cartSummary={cartSummary}
        customerInfo={customerInfo}
        onProceedToPayment={handleProceedToPayment}
        isProcessing={isProcessing}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default ShoppingCartCheckout;