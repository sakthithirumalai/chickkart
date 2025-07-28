import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const RealtimeIndicator = ({ isConnected = false, lastUpdate = null }) => {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
        <span>Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-success">
      <div className={`w-2 h-2 bg-success rounded-full ${showPulse ? 'animate-ping' : 'animate-pulse'}`}></div>
      <span>Live Updates</span>
      {lastUpdate && (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Clock" size={10} />
          <span>Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default RealtimeIndicator;