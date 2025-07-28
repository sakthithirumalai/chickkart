import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentConfirmation = ({ selectedMethod, onConfirmPayment, isProcessing }) => {
  const [transactionId, setTransactionId] = useState('');
  const [showTransactionInput, setShowTransactionInput] = useState(false);

  const handleConfirmPayment = () => {
    if (showTransactionInput && !transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }
    
    onConfirmPayment(transactionId);
  };

  if (!selectedMethod) {
    return (
      <div className="bg-muted/30 rounded-lg border border-border p-6 text-center">
        <Icon name="ArrowUp" size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">
          Please select a payment method above to continue
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-food-card border border-border p-4 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="CheckCircle" size={20} className="mr-2 text-success" />
        Confirm Payment
      </h3>

      <div className="space-y-4">
        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              Payment Method Selected
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedMethod === 'qr' ? 'QR Code Payment' : 
             selectedMethod === 'merchant-upi' ? 'Direct UPI Payment to ChickKart' :
             selectedMethod === 'paytm' ? 'Paytm' :
             selectedMethod === 'gpay' ? 'Google Pay' :
             selectedMethod === 'phonepe' ? 'PhonePe' : 'UPI Payment'}
          </p>
        </div>

        {/* Transaction ID Input (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Transaction Reference (Optional)
            </span>
            <button
              onClick={() => setShowTransactionInput(!showTransactionInput)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {showTransactionInput ? 'Hide' : 'Add Transaction ID'}
            </button>
          </div>
          
          {showTransactionInput && (
            <Input
              type="text"
              placeholder="Enter UPI transaction ID (optional)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              description="This helps us verify your payment faster"
            />
          )}
        </div>

        {/* Confirmation Button */}
        <Button
          variant="success"
          fullWidth
          onClick={handleConfirmPayment}
          loading={isProcessing}
          disabled={isProcessing}
          className="h-12 text-base font-semibold"
        >
          {isProcessing ? (
            <>
              <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Icon name="CheckCircle" size={20} className="mr-2" />
              I've Completed Payment
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By clicking above, you confirm that you have successfully completed the payment
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmation;