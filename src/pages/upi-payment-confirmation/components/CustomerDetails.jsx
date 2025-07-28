import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerDetails = ({ customerInfo }) => {
  return (
    <div className="bg-card rounded-lg shadow-food-card border border-border p-4 mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="User" size={20} className="mr-2" />
        Customer Details
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-base font-medium text-foreground">
              {customerInfo.name || 'Not provided'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Phone" size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="text-base font-medium text-foreground">
              {customerInfo.phone || 'Not provided'}
            </p>
          </div>
        </div>
        
        {customerInfo.notes && (
          <div className="flex items-start space-x-3">
            <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Special Instructions</p>
              <p className="text-base text-foreground">
                {customerInfo.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;