import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PremiumNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/predict':
        return 'Risk Analysis';
      case '/history':
        return 'Prediction History';
      case '/analytics':
        return 'Analytics';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Monitor your loan portfolio and risk metrics';
      case '/predict':
        return 'AI-powered loan default risk assessment';
      case '/history':
        return 'Track your prediction history and trends';
      case '/analytics':
        return 'Deep insights into your lending patterns';
      default:
        return 'Welcome to LoanGuard';
    }
  };

  const notifications = [
    { id: 1, text: 'New model update available', time: '2m ago', type: 'info' },
    { id: 2, text: 'Risk threshold alert', time: '1h ago', type: 'warning' },
    { id: 3, text: 'Monthly report ready', time: '3h ago', type: 'success' },
  ];

  return (
    <nav className="navbar">
      {/* Page Title Section */}
      <div style={{ flex: 1 }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          marginBottom: '4px',
          letterSpacing: '-0.02em'
        }}>
          {getPageTitle()}
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: 'var(--text-secondary)',
          fontWeight: 400
        }}>
          {getPageDescription()}
        </p>
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search predictions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
            flex: 1,
            marginLeft: 'var(--space-sm)',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Right Actions */}
      <div className="navbar-actions">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-smooth)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--accent-primary)';
              e.target.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-danger)',
              border: '2px solid var(--bg-surface)'
            }}></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              width: '320px',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-luxury)',
              zIndex: 1000,
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              <div style={{ 
                padding: 'var(--space-md)', 
                borderBottom: '1px solid var(--border-subtle)',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Notifications
              </div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: 'var(--space-md)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background var(--transition-smooth)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-sm)',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      background: notif.type === 'info' ? 'var(--accent-primary)' :
                                 notif.type === 'warning' ? 'var(--accent-warning)' :
                                 'var(--accent-success)'
                    }}></div>
                    <span style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}>
                      {notif.text}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                      color: 'var(--text-muted)',
                      marginLeft: '18px'
                  }}>
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontWeight: 700,
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all var(--transition-smooth)',
          border: '2px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.borderColor = 'var(--accent-primary)';
          e.target.style.boxShadow = 'var(--shadow-glow)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.borderColor = 'transparent';
          e.target.style.boxShadow = 'none';
        }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavbar;
