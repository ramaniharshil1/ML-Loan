import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PremiumSidebar from './components/PremiumSidebar';
import PremiumNavbar from './components/PremiumNavbar';

// Premium Pages
import Login from './routes/Login';
import Register from './routes/Register';
import PremiumDashboard from './routes/PremiumDashboard';
import PremiumPredict from './routes/PremiumPredict';
import PremiumHistory from './routes/PremiumHistory';
import NotFound from './routes/NotFound';

function PremiumApp() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Router>
      <AuthProvider>
        <div className="App" style={{ 
          background: 'var(--bg-primary)',
          minHeight: '100vh',
          color: 'var(--text-primary)'
        }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div style={{ display: 'flex', minHeight: '100vh' }}>
                    <PremiumSidebar />
                    <div style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      marginLeft: 'var(--sidebar-width)',
                      transition: 'margin-left var(--transition-smooth)'
                    }}>
                      <PremiumNavbar />
                      <main style={{ 
                        flex: 1,
                        background: 'var(--bg-primary)',
                        overflowY: 'auto'
                      }}>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<PremiumDashboard />} />
                          <Route path="/predict" element={<PremiumPredict />} />
                          <Route path="/history" element={<PremiumHistory />} />
                          <Route path="/analytics" element={<PremiumDashboard />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default PremiumApp;
