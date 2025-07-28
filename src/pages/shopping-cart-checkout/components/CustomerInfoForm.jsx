import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomerInfoForm = ({ customerInfo, onCustomerInfoChange, errors }) => {
  const spiceLevelOptions = [
    { value: 'mild', label: 'Mild - Light spice level' },
    { value: 'medium', label: 'Medium - Moderate spice level' },
    { value: 'hot', label: 'Hot - High spice level' },
    { value: 'extra-hot', label: 'Extra Hot - Very high spice level' },
    { value: 'no-spice', label: 'No Spice - Plain preparation' }
  ];

  const handleInputChange = (field, value) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-food-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="User" size={18} className="text-primary" />
        <h3 className="font-semibold text-foreground">Customer Information</h3>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={customerInfo.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          className="w-full"
        />

        {/* Phone Field */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your 10-digit mobile number"
          value={customerInfo.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          required
          maxLength={10}
          pattern="[0-9]{10}"
          className="w-full"
        />

        {/* Spice Level Selection */}
        <Select
          label="Spice Level Preference"
          placeholder="Choose your preferred spice level"
          options={spiceLevelOptions}
          value={customerInfo.spiceLevel || ''}
          onChange={(value) => handleInputChange('spiceLevel', value)}
          description="Help us prepare your order according to your taste"
          className="w-full"
        />

        {/* Special Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Instructions
            <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            placeholder="Any special requests or dietary requirements..."
            value={customerInfo.specialNotes || ''}
            onChange={(e) => handleInputChange('specialNotes', e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
          />
          <div className="mt-1 text-xs text-muted-foreground text-right">
            {(customerInfo.specialNotes || '').length}/200 characters
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-muted/30 rounded-md">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Order Confirmation</p>
            <p>We'll send order updates to your phone number. Please ensure it's correct.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;