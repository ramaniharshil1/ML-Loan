import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PremiumSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Overview', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    },
    { 
      path: '/predict', 
      label: 'Predict', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )
    },
    { 
      path: '/history', 
      label: 'History', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10"/>
          <path d="M12 20V4"/>
          <path d="M6 20v-6"/>
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-content">
          <div className="sidebar-logo-icon">
            L
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ 
                fontSize: '15px', 
                fontWeight: 700, 
                letterSpacing: '-0.02em', 
                color: 'var(--text-primary)' 
              }}>
                LoanGuard
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: 'var(--text-muted)', 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase',
                fontFamily: 'monospace' 
              }}>
                ML Platform
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--accent-primary)';
            e.target.style.background = 'var(--bg-glass)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--text-secondary)';
            e.target.style.background = 'none';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isCollapsed ? (
              <path d="M9 18l6-6-6-6"/>
            ) : (
              <path d="M15 18l-6-6 6-6"/>
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: isCollapsed ? 'var(--space-md)' : 'var(--space-md) var(--space-lg)',
              margin: '0 var(--space-md) var(--space-xs)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition-smooth)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span className="nav-icon" style={{ opacity: 0.8 }}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 500,
                letterSpacing: '0.025em'
              }}>
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {!isCollapsed && (
        <div style={{ 
          padding: 'var(--space-lg)', 
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto'
        }}>
          <div style={{ 
            marginBottom: 'var(--space-md)',
            padding: 'var(--space-md)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text-muted)', 
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Logged in as
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: '2px'
            }}>
              {user?.name || 'User'}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              fontFamily: 'monospace'
            }}>
              {user?.email}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'none',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-smooth)',
              fontSize: '14px',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--accent-danger)';
              e.target.style.borderColor = 'rgba(255, 71, 87, 0.3)';
              e.target.style.background = 'rgba(255, 71, 87, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.background = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div style={{ 
          padding: 'var(--space-lg)', 
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto',
          textAlign: 'center'
        }}>
          <div
            onClick={handleLogout}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 700,
              cursor: 'pointer',
              margin: '0 auto',
              transition: 'all var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      )}
    </aside>
  );
};

export default PremiumSidebar;
