import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI } from '../api/client';

const Predict = () => {
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
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Loan Risk Prediction</h2>
        <p className="text-gray-400">
          Enter loan details to analyze default risk using AI
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Loan Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="25"
                    min="18"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Credit Score</label>
                  <input
                    type="number"
                    name="credit_score"
                    value={formData.credit_score}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="650"
                    min="300"
                    max="850"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Marital Status</label>
                <select
                  name="marital"
                  value={formData.marital}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Financial Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Annual Income ($)</label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="75000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Months Employed</label>
                  <input
                    type="number"
                    name="months_employed"
                    value={formData.months_employed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="36"
                    min="0"
                    max="600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type</label>
                <select
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Debt-to-Income Ratio (%)</label>
                <input
                  type="number"
                  name="dti_ratio"
                  value={formData.dti_ratio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="25"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Loan Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Loan Amount ($)</label>
                  <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="250000"
                    min="1000"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="4.5"
                    min="0"
                    max="30"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Risk'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result */}
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Prediction Result</h3>
          
          {!result ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-gray-400 mb-2">No prediction yet</p>
              <p className="text-sm text-gray-500">
                Fill out the form and click "Analyze Risk" to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`text-center p-6 rounded-lg ${
                isSafe 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="text-6xl mb-4">
                  {isSafe ? '✅' : '⚠️'}
                </div>
                <div className={`text-2xl font-bold mb-2 ${
                  isSafe ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.prediction}
                </div>
                <p className="text-gray-300">
                  {isSafe 
                    ? 'This loan appears to be low risk'
                    : 'This loan carries significant risk'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Risk Analysis
                </h4>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Risk Level</span>
                  <span className={`font-semibold ${
                    isSafe ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isSafe ? 'Low' : 'High'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Recommendation</span>
                  <span className={`font-semibold ${
                    isSafe ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {isSafe ? 'Proceed' : 'Review Carefully'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/history')}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  View History
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
