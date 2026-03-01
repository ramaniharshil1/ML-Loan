import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI } from '../api/client';

const Dashboard = () => {
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
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const safePercentage = stats?.safe_percent || 0;
  const riskPercentage = 100 - safePercentage;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
        <p className="text-blue-100">
          Monitor your loan predictions and analyze risk patterns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.total || 0}
          </div>
          <p className="text-sm text-gray-400">Total Predictions</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <span className="text-sm text-gray-400">Safe</span>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-1">
            {stats?.safe || 0}
          </div>
          <p className="text-sm text-gray-400">Safe Loans</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="text-sm text-gray-400">Risk</span>
          </div>
          <div className="text-3xl font-bold text-red-400 mb-1">
            {stats?.risk || 0}
          </div>
          <p className="text-sm text-gray-400">Risky Loans</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <span className="text-sm text-gray-400">Success Rate</span>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {safePercentage.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-400">Safe Predictions</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Risk Distribution</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Safe Loans</span>
                <span className="text-sm font-bold text-green-400">{safePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, safePercentage))}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Risky Loans</span>
                <span className="text-sm font-bold text-red-400">{riskPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, riskPercentage))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Average Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Credit Score</span>
              <span className="text-white font-semibold">
                {stats?.avg_credit || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Loan Amount</span>
              <span className="text-white font-semibold">
                ${((stats?.avg_loan || 0) / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">DTI Ratio</span>
              <span className="text-white font-semibold">
                {(stats?.avg_dti || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Income</span>
              <span className="text-white font-semibold">
                ${((stats?.avg_income || 0) / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/predict')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            <span className="mr-2">🔮</span>
            New Prediction
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600"
          >
            <span className="mr-2">📜</span>
            View History
          </button>
        </div>
      </div>

      {/* Summary */}
      {stats?.total > 0 && (
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Summary</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {safePercentage > 70 ? '🎯' : safePercentage > 50 ? '📊' : '⚠️'}
            </div>
            <p className="text-lg text-gray-300 mb-2">
              You've made <span className="font-bold text-white">{stats.total}</span> predictions
            </p>
            <p className="text-sm text-gray-400">
              {safePercentage > 70 
                ? 'Great! Most of your predictions are safe loans.' 
                : safePercentage > 50 
                ? 'Mixed risk profile. Continue monitoring.'
                : 'High risk detected. Review criteria carefully.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
