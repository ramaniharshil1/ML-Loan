import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI } from '../api/client';

const PremiumDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await predictionAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh' 
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass" style={{ 
        padding: 'var(--space-2xl)', 
        textAlign: 'center',
        maxWidth: '500px',
        margin: 'var(--space-2xl) auto'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: 'var(--space-md)',
          opacity: 0.5
        }}>
          ⚠️
        </div>
        <h3 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: 'var(--space-sm)' 
        }}>
          Unable to Load Dashboard
        </h3>
        <p style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: 'var(--space-lg)' 
        }}>
          {error}
        </p>
        <button 
          onClick={fetchStats}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const safePercentage = stats?.safe_percent || 0;
  const riskPercentage = 100 - safePercentage;

  return (
    <div style={{ padding: 'var(--space-2xl)' }}>
      {/* Hero Section */}
      <div className="card card-luxury" style={{ 
        marginBottom: 'var(--space-2xl)',
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(124, 58, 237, 0.1) 100%)',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: 'var(--space-sm)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to LoanGuard
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            Advanced AI-powered loan default prediction platform. Monitor risk, analyze trends, and make data-driven lending decisions.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-2xl)'
      }}>
        <div className="stat-card animate-fadeInUp">
          <div className="stat-icon" style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6M23 11h-6"/>
            </svg>
          </div>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">Total Predictions</div>
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>All time analysis</span>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="stat-icon" style={{ 
            background: 'var(--gradient-success)',
            boxShadow: 'var(--success-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-value">{stats?.safe || 0}</div>
          <div className="stat-label">Safe Loans</div>
          <div className="progress-bar" style={{ marginTop: 'var(--space-sm)' }}>
            <div 
              className="progress-fill progress-success"
              style={{ width: `${safePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="stat-icon" style={{ 
            background: 'var(--gradient-danger)',
            boxShadow: 'var(--danger-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-value">{stats?.risk || 0}</div>
          <div className="stat-label">Risky Loans</div>
          <div className="progress-bar" style={{ marginTop: 'var(--space-sm)' }}>
            <div 
              className="progress-fill progress-danger"
              style={{ width: `${riskPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="stat-icon" style={{ 
            background: 'linear-gradient(135deg, #ffd93d, #ff6b7a)',
            boxShadow: '0 0 20px rgba(255, 217, 61, 0.3)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="stat-value">{safePercentage.toFixed(1)}%</div>
          <div className="stat-label">Success Rate</div>
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: '12px',
            color: safePercentage > 70 ? 'var(--accent-success)' : 
                   safePercentage > 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'
          }}>
            {safePercentage > 70 ? 'Excellent performance' :
             safePercentage > 50 ? 'Moderate performance' : 'Needs attention'}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--space-2xl)',
        marginBottom: 'var(--space-2xl)'
      }}>
        {/* Risk Distribution */}
        <div className="card animate-slideInLeft">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)'
          }}>
            Risk Distribution
          </h3>
          
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Safe Loans</span>
              <span style={{ 
                color: 'var(--accent-success)', 
                fontSize: '18px', 
                fontWeight: 700 
              }}>
                {safePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar" style={{ height: '12px' }}>
              <div 
                className="progress-fill progress-success"
                style={{ width: `${safePercentage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Risky Loans</span>
              <span style={{ 
                color: 'var(--accent-danger)', 
                fontSize: '18px', 
                fontWeight: 700 
              }}>
                {riskPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar" style={{ height: '12px' }}>
              <div 
                className="progress-fill progress-danger"
                style={{ width: `${riskPercentage}%` }}
              ></div>
            </div>
          </div>

          <div style={{
            marginTop: 'var(--space-xl)',
            padding: 'var(--space-md)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-sm)'
            }}>
              Portfolio Health
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 700,
              background: safePercentage > 70 ? 'var(--gradient-success)' :
                         safePercentage > 50 ? 'linear-gradient(135deg, var(--accent-warning), var(--accent-primary))' :
                         'var(--gradient-danger)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {safePercentage > 70 ? 'Healthy' :
               safePercentage > 50 ? 'Moderate' : 'High Risk'}
            </div>
          </div>
        </div>

        {/* Average Metrics */}
        <div className="card animate-slideInLeft" style={{ animationDelay: '100ms' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)'
          }}>
            Portfolio Metrics
          </h3>
          
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            <div className="glass" style={{ 
              padding: 'var(--space-md)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  AVG CREDIT SCORE
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stats?.avg_credit || 0}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>

            <div className="glass" style={{ 
              padding: 'var(--space-md)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  AVG LOAN AMOUNT
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${((stats?.avg_loan || 0) / 1000).toFixed(1)}K
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>

            <div className="glass" style={{ 
              padding: 'var(--space-md)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  AVG DTI RATIO
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {(stats?.avg_dti || 0).toFixed(1)}%
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6"/>
                </svg>
              </div>
            </div>

            <div className="glass" style={{ 
              padding: 'var(--space-md)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  AVG INCOME
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${((stats?.avg_income || 0) / 1000).toFixed(1)}K
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #fa709a, #fee140)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          marginBottom: 'var(--space-lg)',
          color: 'var(--text-primary)'
        }}>
          Quick Actions
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--space-lg)' 
        }}>
          <button 
            onClick={() => navigate('/predict')}
            className="btn btn-primary"
            style={{ 
              height: '56px',
              fontSize: '16px',
              fontWeight: 600,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{ marginRight: '8px' }}>🔮</span>
            New Prediction
          </button>
          
          <button 
            onClick={() => navigate('/history')}
            className="btn btn-secondary"
            style={{ 
              height: '56px',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            <span style={{ marginRight: '8px' }}>📊</span>
            View History
          </button>
          
          <button 
            className="btn btn-secondary"
            style={{ 
              height: '56px',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            <span style={{ marginRight: '8px' }}>📈</span>
            Analytics
          </button>
          
          <button 
            className="btn btn-secondary"
            style={{ 
              height: '56px',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            <span style={{ marginRight: '8px' }}>⚙️</span>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
