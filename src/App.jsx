import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;