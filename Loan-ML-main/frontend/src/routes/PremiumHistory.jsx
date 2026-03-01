import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../api/client';

const PremiumHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await predictionAPI.getHistory();
      setPredictions(response.data);
    } catch (err) {
      setError('Failed to load prediction history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    setDeletingId(id);
    try {
      await predictionAPI.deletePrediction(id);
      setPredictions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete prediction');
      console.error('Error deleting prediction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = 
      prediction.loan_amount.toString().includes(searchTerm) ||
      prediction.credit_score.toString().includes(searchTerm) ||
      prediction.result.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'safe' && prediction.result === 'Safe') ||
      (filter === 'risk' && prediction.result === 'Risk');
    
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div style={{ padding: 'var(--space-2xl)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-2xl)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: 'var(--space-sm)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Prediction History
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            Track and analyze your loan risk predictions over time
          </p>
        </div>
        
        <button
          onClick={fetchHistory}
          className="btn btn-secondary"
          style={{ height: '48px' }}
        >
          <span style={{ marginRight: '8px' }}>🔄</span>
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass" style={{ 
          padding: 'var(--space-lg)', 
          marginBottom: 'var(--space-xl)',
          border: '1px solid rgba(255, 71, 87, 0.3)',
          background: 'rgba(255, 71, 87, 0.1)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--accent-danger)', fontWeight: 500 }}>
            {error}
          </p>
        </div>
      )}

      {/* Stats Cards */}
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
              <path d="M9 11H3v10h6V11z"/>
              <path d="M15 3H9v18h6V3z"/>
              <path d="M21 7h-6v14h6V7z"/>
            </svg>
          </div>
          <div className="stat-value">{predictions.length}</div>
          <div className="stat-label">Total Predictions</div>
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
          <div className="stat-value">{predictions.filter(p => p.result === 'Safe').length}</div>
          <div className="stat-label">Safe Loans</div>
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
          <div className="stat-value">{predictions.filter(p => p.result === 'Risk').length}</div>
          <div className="stat-label">Risky Loans</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card" style={{ 
        marginBottom: 'var(--space-xl)',
        padding: 'var(--space-lg)',
        display: 'flex',
        gap: 'var(--space-lg)',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="navbar-search" style={{ width: '100%' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ height: '40px', fontSize: '14px' }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('safe')}
            className={`btn ${filter === 'safe' ? 'btn-success' : 'btn-secondary'}`}
            style={{ height: '40px', fontSize: '14px' }}
          >
            Safe
          </button>
          <button
            onClick={() => setFilter('risk')}
            className={`btn ${filter === 'risk' ? 'btn-danger' : 'btn-secondary'}`}
            style={{ height: '40px', fontSize: '14px' }}
          >
            Risk
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="table-container animate-fadeInUp">
        {filteredPredictions.length === 0 ? (
          <div style={{ 
            padding: 'var(--space-3xl)', 
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '80px', 
              marginBottom: 'var(--space-lg)',
              opacity: 0.3
            }}>
              📭
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)'
            }}>
              {searchTerm || filter !== 'all' ? 'No matching predictions found' : 'No predictions yet'}
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: 'var(--space-xl)',
              maxWidth: '400px',
              margin: '0 auto var(--space-xl)'
            }}>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start analyzing loan risks to see your prediction history here.'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button className="btn btn-primary" style={{ height: '48px' }}>
                <span style={{ marginRight: '8px' }}>🔮</span>
                Make First Prediction
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Date & Time</th>
                  <th style={{ width: '120px' }}>Result</th>
                  <th style={{ width: '140px' }}>Loan Amount</th>
                  <th style={{ width: '120px' }}>Credit Score</th>
                  <th style={{ width: '100px' }}>DTI Ratio</th>
                  <th style={{ width: '140px' }}>Income</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.map((prediction, index) => (
                  <tr 
                    key={prediction.id}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 50}ms both`
                    }}
                  >
                    <td>
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          color: 'var(--text-primary)',
                          marginBottom: '2px'
                        }}>
                          {new Date(prediction.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace'
                        }}>
                          {new Date(prediction.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${prediction.result === 'Safe' ? 'badge-success' : 'badge-danger'}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>
                          {prediction.result === 'Safe' ? '✓' : '!'}
                        </span>
                        {prediction.result}
                      </span>
                    </td>
                    <td style={{ 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace'
                    }}>
                      {formatCurrency(prediction.loan_amount)}
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ 
                          fontWeight: 600,
                          color: prediction.credit_score >= 700 ? 'var(--accent-success)' :
                                 prediction.credit_score >= 600 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                        }}>
                          {prediction.credit_score}
                        </span>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: 'var(--radius-full)',
                          background: prediction.credit_score >= 700 ? 'var(--accent-success)' :
                                     prediction.credit_score >= 600 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                        }}></div>
                      </div>
                    </td>
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ 
                          fontWeight: 600,
                          color: prediction.dti_ratio <= 30 ? 'var(--accent-success)' :
                                 prediction.dti_ratio <= 45 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                        }}>
                          {prediction.dti_ratio}%
                        </span>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: 'var(--radius-full)',
                          background: prediction.dti_ratio <= 30 ? 'var(--accent-success)' :
                                     prediction.dti_ratio <= 45 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                        }}></div>
                      </div>
                    </td>
                    <td style={{ 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace'
                    }}>
                      {formatCurrency(prediction.income)}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(prediction.id)}
                        disabled={deletingId === prediction.id}
                        className="btn btn-danger"
                        style={{ 
                          height: '36px', 
                          fontSize: '12px',
                          padding: '0 var(--space-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {deletingId === prediction.id ? (
                          <div className="loading-spinner" style={{ width: '12px', height: '12px' }}></div>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics Summary */}
      {predictions.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 'var(--space-xl)',
          marginTop: 'var(--space-2xl)'
        }}>
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
                  {((predictions.filter(p => p.result === 'Safe').length / predictions.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: '12px' }}>
                <div 
                  className="progress-fill progress-success"
                  style={{ 
                    width: `${(predictions.filter(p => p.result === 'Safe').length / predictions.length) * 100}%` 
                  }}
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
                  {((predictions.filter(p => p.result === 'Risk').length / predictions.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: '12px' }}>
                <div 
                  className="progress-fill progress-danger"
                  style={{ 
                    width: `${(predictions.filter(p => p.result === 'Risk').length / predictions.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card animate-slideInLeft" style={{ animationDelay: '100ms' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: 'var(--space-lg)',
              color: 'var(--text-primary)'
            }}>
              Average Metrics
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
                    {Math.round(predictions.reduce((sum, p) => sum + p.credit_score, 0) / predictions.length)}
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
                    ${((predictions.reduce((sum, p) => sum + p.loan_amount, 0) / predictions.length) / 1000).toFixed(1)}K
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumHistory;
