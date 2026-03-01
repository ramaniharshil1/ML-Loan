import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI } from '../api/client';

const PremiumPredict = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    loan_amount: '',
    credit_score: '',
    months_employed: '',
    interest_rate: '',
    dti_ratio: '',
    education: 'Bachelor',
    employment: 'Full-time',
    marital: 'Single',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await predictionAPI.predict(formData);
      setResult(response.data);
    } catch (err) {
      const message = err.response?.data?.error || 'Prediction failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: '',
      income: '',
      loan_amount: '',
      credit_score: '',
      months_employed: '',
      interest_rate: '',
      dti_ratio: '',
      education: 'Bachelor',
      employment: 'Full-time',
      marital: 'Single',
    });
    setResult(null);
    setError('');
  };

  const isSafe = result?.prediction === 'Safe';

  return (
    <div style={{ padding: 'var(--space-2xl)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          marginBottom: 'var(--space-md)',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AI Risk Analysis
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Advanced machine learning algorithms analyze loan parameters to predict default risk with exceptional accuracy.
        </p>
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
          <div style={{ 
            fontSize: '48px', 
            marginBottom: 'var(--space-md)',
            opacity: 0.7
          }}>
            ⚠️
          </div>
          <p style={{ color: 'var(--accent-danger)', fontWeight: 500 }}>
            {error}
          </p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--space-3xl)',
        alignItems: 'start'
      }}>
        {/* Premium Form */}
        <div className="card card-luxury" style={{ 
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(30, 33, 57, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              marginBottom: 'var(--space-xl)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                📝
              </div>
              Loan Information
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              {/* Personal Information */}
              <div>
                <h3 style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Personal Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('age')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="25"
                      min="18"
                      max="100"
                      required
                      style={{
                        borderColor: focusedField === 'age' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'age' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Credit Score</label>
                    <input
                      type="number"
                      name="credit_score"
                      value={formData.credit_score}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('credit_score')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="650"
                      min="300"
                      max="850"
                      required
                      style={{
                        borderColor: focusedField === 'credit_score' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'credit_score' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Education Level</label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="form-select"
                    required
                    style={{
                      borderColor: focusedField === 'education' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      boxShadow: focusedField === 'education' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                    }}
                    onFocus={() => setFocusedField('education')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="High School">High School</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="marital"
                    value={formData.marital}
                    onChange={handleChange}
                    className="form-select"
                    required
                    style={{
                      borderColor: focusedField === 'marital' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      boxShadow: focusedField === 'marital' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                    }}
                    onFocus={() => setFocusedField('marital')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Financial Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Annual Income ($)</label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('income')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="75000"
                      min="0"
                      step="1000"
                      required
                      style={{
                        borderColor: focusedField === 'income' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'income' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Months Employed</label>
                    <input
                      type="number"
                      name="months_employed"
                      value={formData.months_employed}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('months_employed')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="36"
                      min="0"
                      max="600"
                      required
                      style={{
                        borderColor: focusedField === 'months_employed' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'months_employed' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select
                    name="employment"
                    value={formData.employment}
                    onChange={handleChange}
                    className="form-select"
                    required
                    style={{
                      borderColor: focusedField === 'employment' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      boxShadow: focusedField === 'employment' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                    }}
                    onFocus={() => setFocusedField('employment')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Debt-to-Income Ratio (%)</label>
                  <input
                    type="number"
                    name="dti_ratio"
                    value={formData.dti_ratio}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('dti_ratio')}
                    onBlur={() => setFocusedField('')}
                    className="form-input"
                    placeholder="25"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                    style={{
                      borderColor: focusedField === 'dti_ratio' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      boxShadow: focusedField === 'dti_ratio' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                    }}
                  />
                </div>
              </div>

              {/* Loan Details */}
              <div>
                <h3 style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)'
                }}>
                  Loan Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Loan Amount ($)</label>
                    <input
                      type="number"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('loan_amount')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="250000"
                      min="1000"
                      step="1000"
                      required
                      style={{
                        borderColor: focusedField === 'loan_amount' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'loan_amount' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interest Rate (%)</label>
                    <input
                      type="number"
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('interest_rate')}
                      onBlur={() => setFocusedField('')}
                      className="form-input"
                      placeholder="4.5"
                      min="0"
                      max="30"
                      step="0.1"
                      required
                      style={{
                        borderColor: focusedField === 'interest_rate' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        boxShadow: focusedField === 'interest_rate' ? '0 0 0 3px rgba(0, 212, 255, 0.1), var(--shadow-glow)' : 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-md)', 
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 600,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                      Analyzing Risk...
                    </div>
                  ) : (
                    <>
                      <span style={{ marginRight: '8px' }}>🔮</span>
                      Analyze Risk
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="btn btn-secondary"
                  style={{
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Premium Result Display */}
        <div className="card card-luxury" style={{ 
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(30, 33, 57, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Background Animation */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: result ? (
              isSafe ? 'radial-gradient(circle, rgba(16, 249, 129, 0.1) 0%, transparent 70%)' :
                       'radial-gradient(circle, rgba(255, 71, 87, 0.1) 0%, transparent 70%)'
            ) : 'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)',
            animation: result ? 'pulse 3s ease-in-out infinite' : 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              marginBottom: 'var(--space-xl)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: result ? (
                  isSafe ? 'var(--gradient-success)' : 'var(--gradient-danger)'
                ) : 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: result ? (
                  isSafe ? 'var(--success-glow)' : 'var(--danger-glow)'
                ) : 'var(--shadow-glow)'
              }}>
                {result ? (isSafe ? '✓' : '!') : '📊'}
              </div>
              Prediction Result
            </h2>
            
            {!result ? (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: 'var(--space-lg)',
                  opacity: 0.3,
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  🤔
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-md)'
                }}>
                  Ready for Analysis
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  maxWidth: '300px',
                  lineHeight: 1.6
                }}>
                  Complete the loan information form and click "Analyze Risk" to receive an AI-powered prediction.
                </p>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Result Badge */}
                <div className="glass" style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  marginBottom: 'var(--space-xl)',
                  border: `2px solid ${isSafe ? 'rgba(16, 249, 129, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`,
                  background: isSafe ? 'rgba(16, 249, 129, 0.05)' : 'rgba(255, 71, 87, 0.05)',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Glowing Ring Animation */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    border: `2px solid ${isSafe ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                    borderRadius: 'var(--radius-xl)',
                    opacity: 0.3,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}></div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      fontSize: '72px', 
                      marginBottom: 'var(--space-md)',
                      filter: isSafe ? 'drop-shadow(0 0 20px rgba(16, 249, 129, 0.5))' : 'drop-shadow(0 0 20px rgba(255, 71, 87, 0.5))'
                    }}>
                      {isSafe ? '✅' : '⚠️'}
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      marginBottom: 'var(--space-sm)',
                      background: isSafe ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {result.prediction}
                    </div>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }}>
                      {isSafe 
                        ? 'This loan appears to have low default risk based on our AI analysis.'
                        : 'This loan carries significant default risk. Proceed with caution.'
                      }
                    </p>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'var(--space-md)'
                  }}>
                    Risk Analysis
                  </h3>
                  
                  <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                    <div className="glass" style={{ 
                      padding: 'var(--space-md)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Risk Level</span>
                      <span className={`badge ${isSafe ? 'badge-success' : 'badge-danger'}`}>
                        {isSafe ? 'Low' : 'High'}
                      </span>
                    </div>
                    
                    <div className="glass" style={{ 
                      padding: 'var(--space-md)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Recommendation</span>
                      <span style={{ 
                        color: isSafe ? 'var(--accent-success)' : 'var(--accent-warning)', 
                        fontWeight: 600,
                        fontSize: '14px'
                      }}>
                        {isSafe ? 'Proceed' : 'Review Carefully'}
                      </span>
                    </div>

                    <div className="glass" style={{ 
                      padding: 'var(--space-md)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Credit Score</span>
                      <span style={{ 
                        color: formData.credit_score >= 700 ? 'var(--accent-success)' :
                               formData.credit_score >= 600 ? 'var(--accent-warning)' : 'var(--accent-danger)',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}>
                        {formData.credit_score}
                      </span>
                    </div>

                    <div className="glass" style={{ 
                      padding: 'var(--space-md)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>DTI Ratio</span>
                      <span style={{ 
                        color: formData.dti_ratio <= 30 ? 'var(--accent-success)' :
                               formData.dti_ratio <= 45 ? 'var(--accent-warning)' : 'var(--accent-danger)',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}>
                        {formData.dti_ratio}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-md)', 
                  marginTop: 'auto'
                }}>
                  <button
                    onClick={() => navigate('/history')}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      height: '48px',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>📊</span>
                    View History
                  </button>
                  <button
                    onClick={handleReset}
                    className={`btn ${isSafe ? 'btn-success' : 'btn-primary'}`}
                    style={{
                      flex: 1,
                      height: '48px',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>🔄</span>
                    New Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPredict;
