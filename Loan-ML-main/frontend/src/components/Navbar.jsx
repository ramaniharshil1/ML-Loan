import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/predict':
        return 'Loan Prediction';
      case '/history':
        return 'Prediction History';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Overview of your loan predictions and statistics';
      case '/predict':
        return 'Analyze loan default risk using AI';
      case '/history':
        return 'View your prediction history';
      default:
        return 'Welcome to LoanPredict';
    }
  };

  return (
    <header className="bg-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          <p className="text-sm text-gray-400 mt-1">{getPageDescription()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Time</p>
            <p className="text-white font-medium">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
