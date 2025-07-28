import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CheckoutActions = ({ 
  cartSummary, 
  customerInfo, 
  onProceedToPayment, 
  isProcessing = false,
  validationErrors = {}
}) => {
  const navigate = useNavigate();
  
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isFormValid = customerInfo.name && customerInfo.phone && !hasValidationErrors;
  const canProceed = !cartSummary.isEmpty && isFormValid && !isProcessing;

  const deliveryFee = 0;
  const platformFee = 5;
  const grandTotal = cartSummary.total + deliveryFee + platformFee;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-food-modal">
      <div className="max-w-7xl mx-auto">
        {/* Order Total Summary */}
        <div className="flex items-center justify-between mb-4 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Receipt" size={18} className="text-primary" />
            <span className="font-medium text-foreground">Total Amount</span>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-xl text-primary">
              ₹{grandTotal.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              {cartSummary.itemCount} item{cartSummary.itemCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action Button */}
          <Button
            variant="default"
            fullWidth
            size="lg"
            onClick={onProceedToPayment}
            disabled={!canProceed}
            loading={isProcessing}
            iconName="CreditCard"
            iconPosition="left"
            className="scale-feedback"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          {/* Validation Messages */}
          {hasValidationErrors && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-error mb-1">Please fix the following:</p>
                  <ul className="text-error/80 space-y-1">
                    {Object.values(validationErrors).map((error, index) => (
                      <li key={index} className="text-xs">• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customer-menu-browse')}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Continue Shopping
            </Button>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Quick Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Preview */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>Accepted payments:</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">UPI</span>
              <span>•</span>
              <span className="font-medium">GPay</span>
              <span>•</span>
              <span className="font-medium">Paytm</span>
              <span>•</span>
              <span className="font-medium">PhonePe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutActions;