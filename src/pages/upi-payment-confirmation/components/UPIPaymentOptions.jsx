import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UPIPaymentOptions = ({ total, onPaymentMethodSelect, selectedMethod }) => {
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  // Merchant UPI ID for direct payments
  const merchantUpiId = 'thirumalairk67@oksbi';

  const upiApps = [
    {
      id: 'paytm',
      name: 'Paytm',
      icon: 'Smartphone',
      color: 'bg-blue-500',
      upiId: 'paytm@paytm'
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: 'Smartphone',
      color: 'bg-green-500',
      upiId: 'gpay@okaxis'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: 'Smartphone',
      color: 'bg-purple-500',
      upiId: 'phonepe@ybl'
    }
  ];

  const generateUPILink = (app) => {
    const merchantId = 'CHICKART001';
    const transactionId = `TXN${Date.now()}`;
    const upiLink = `upi://pay?pa=${app.upiId}&pn=ChickKart&am=${total}&cu=INR&tn=Order Payment&tr=${transactionId}`;
    
    onPaymentMethodSelect(app.id);
    
    // Simulate opening UPI app
    if (window.confirm(`Open ${app.name} to complete payment of ₹${total.toFixed(2)}?`)) {
      // In real implementation, this would open the UPI app
      console.log(`Opening ${app.name} with UPI link:`, upiLink);
    }
  };

  const generateMerchantUPILink = () => {
    const transactionId = `TXN${Date.now()}`;
    const upiLink = `upi://pay?pa=${merchantUpiId}&pn=ChickKart&am=${total}&cu=INR&tn=Order Payment&tr=${transactionId}`;
    
    onPaymentMethodSelect('merchant-upi');
    
    // Simulate opening UPI app
    if (window.confirm(`Pay directly to ChickKart UPI (${merchantUpiId}) - ₹${total.toFixed(2)}?`)) {
      // In real implementation, this would open the default UPI app
      console.log(`Opening UPI app with merchant link:`, upiLink);
    }
  };

  const generateQRCode = () => {
    setQrCodeGenerated(true);
    onPaymentMethodSelect('qr');
  };

  return (
    <div className="bg-card rounded-lg shadow-food-card border border-border p-4 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="CreditCard" size={20} className="mr-2" />
        Choose Payment Method
      </h3>

      {/* Merchant UPI Payment */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">
          Pay directly to ChickKart
        </p>
        <Button
          variant={selectedMethod === 'merchant-upi' ? 'default' : 'outline'}
          onClick={generateMerchantUPILink}
          className="w-full h-16 flex items-center justify-center space-x-3 mb-4"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Building2" size={20} color="white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Pay to ChickKart</div>
            <div className="text-sm opacity-80">{merchantUpiId}</div>
          </div>
        </Button>
      </div>

      {/* UPI App Buttons */}
      <div className="space-y-3 mb-6">
        <p className="text-sm text-muted-foreground mb-3">
          Or select your preferred UPI app to pay ₹{total.toFixed(2)}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {upiApps.map((app) => (
            <Button
              key={app.id}
              variant={selectedMethod === app.id ? 'default' : 'outline'}
              onClick={() => generateUPILink(app)}
              className="h-16 flex-col space-y-1"
            >
              <div className={`w-8 h-8 rounded-full ${app.color} flex items-center justify-center mb-1`}>
                <Icon name={app.icon} size={16} color="white" />
              </div>
              <span className="text-sm font-medium">{app.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            Or scan QR code
          </span>
          <Button
            variant={selectedMethod === 'qr' ? 'default' : 'outline'}
            size="sm"
            onClick={generateQRCode}
          >
            <Icon name="QrCode" size={16} className="mr-2" />
            Generate QR
          </Button>
        </div>

        {qrCodeGenerated && (
          <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
            <div className="w-48 h-48 bg-white border-2 border-border rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="QrCode" size={64} className="text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  QR Code for ₹{total.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pay to: {merchantUpiId}
                </p>
                <p className="text-xs text-muted-foreground">
                  Scan with any UPI app
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      {selectedMethod && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="text-primary font-medium mb-1">Payment Instructions:</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Complete the payment in your UPI app</li>
                <li>• Return to this page after payment</li>
                <li>• Click "I've Paid" button below to confirm</li>
                <li>• Keep your transaction ID for reference</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPIPaymentOptions;