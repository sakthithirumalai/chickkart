import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground"/>
          <rect width="100%" height="100%" fill="url(#dots)" className="text-primary"/>
        </svg>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse-subtle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full blur-xl animate-pulse-subtle" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/5 rounded-full blur-xl animate-pulse-subtle" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-success/5 rounded-full blur-xl animate-pulse-subtle" style={{animationDelay: '0.5s'}}></div>
      
      {/* Food-themed Icons */}
      <div className="absolute top-1/4 left-1/4 opacity-3">
        <div className="w-16 h-16 text-primary/10 transform rotate-12">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      
      <div className="absolute top-3/4 right-1/4 opacity-3">
        <div className="w-20 h-20 text-accent/10 transform -rotate-12">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPattern;