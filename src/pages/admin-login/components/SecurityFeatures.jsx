import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Check for existing session
    const authToken = localStorage.getItem('chickKartAdminAuth');
    const authExpiry = localStorage.getItem('chickKartAdminAuthExpiry');
    
    if (authToken && authExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(authExpiry);
      const timeRemaining = expiry - now;
      
      // Show warning if session expires in less than 30 minutes
      if (timeRemaining > 0 && timeRemaining < 30 * 60 * 1000) {
        setSessionWarning(true);
        setTimeLeft(Math.floor(timeRemaining / (60 * 1000)));
        
        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
          const remaining = expiry - currentTime;
          
          if (remaining <= 0) {
            localStorage.removeItem('chickKartAdminAuth');
            localStorage.removeItem('chickKartAdminAuthExpiry');
            setSessionWarning(false);
            clearInterval(interval);
          } else {
            setTimeLeft(Math.floor(remaining / (60 * 1000)));
          }
        }, 60000);
        
        return () => clearInterval(interval);
      }
    }
  }, []);

  const extendSession = () => {
    const newExpiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('chickKartAdminAuthExpiry', newExpiry.toString());
    setSessionWarning(false);
    setTimeLeft(null);
  };

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Secure Authentication',
      description: 'Your login credentials are encrypted and protected'
    },
    {
      icon: 'Clock',
      title: 'Session Management',
      description: 'Automatic logout after 24 hours of inactivity'
    },
    {
      icon: 'Eye',
      title: 'Activity Monitoring',
      description: 'All admin actions are logged for security'
    },
    {
      icon: 'Lock',
      title: 'Role-Based Access',
      description: 'Access controls based on your staff permissions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Session Warning */}
      {sessionWarning && (
        <div className="bg-warning/10 border border-warning/20 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={20} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-warning mb-1">Session Expiring Soon</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your session will expire in {timeLeft} minutes. Extend your session to continue working.
              </p>
              <button
                onClick={extendSession}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors hover-lift"
              >
                Extend Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="bg-muted/30 rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Security Features</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Login Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Last successful login: Today at 09:15 AM</p>
        <p className="mt-1">Secure connection established • IP: 192.168.1.100</p>
      </div>
    </div>
  );
};

export default SecurityFeatures;