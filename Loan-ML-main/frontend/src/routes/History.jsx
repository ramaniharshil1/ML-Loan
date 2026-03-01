import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../api/client';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Prediction History</h2>
          <p className="text-gray-400">
            View and manage your past loan risk predictions
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-600"
        >
          <span className="mr-2">🔄</span>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Predictions</p>
              <p className="text-2xl font-bold text-white">{predictions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Safe Loans</p>
              <p className="text-2xl font-bold text-green-400">
                {predictions.filter(p => p.result === 'Safe').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Risky Loans</p>
              <p className="text-2xl font-bold text-red-400">
                {predictions.filter(p => p.result === 'Risk').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Prediction Records</h3>
        
        {predictions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 mb-2">No predictions yet</p>
            <p className="text-sm text-gray-500 mb-6">
              Start analyzing loan risks to see your history here
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
              Make First Prediction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Result</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Loan Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Credit Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">DTI Ratio</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Income</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction) => (
                  <tr key={prediction.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(prediction.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(prediction.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prediction.result === 'Safe' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {prediction.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {formatCurrency(prediction.loan_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        prediction.credit_score >= 700 
                          ? 'text-green-400'
                          : prediction.credit_score >= 600
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {prediction.credit_score}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        prediction.dti_ratio <= 30
                          ? 'text-green-400'
                          : prediction.dti_ratio <= 45
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {prediction.dti_ratio}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {formatCurrency(prediction.income)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(prediction.id)}
                        disabled={deletingId === prediction.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingId === prediction.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Delete'
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
    </div>
  );
};

export default History;
