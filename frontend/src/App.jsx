import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import History from './pages/History';
import UsersList from './pages/UsersList';

// Layout wrapper component
const MainLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Route wrapper to supply specific page titles to the header
const LayoutRoute = ({ children, title, adminOnly = false }) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <MainLayout title={title}>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <LayoutRoute title="Dashboard Summary">
            <Dashboard />
          </LayoutRoute>
        } 
      />
      <Route 
        path="/plans" 
        element={
          <LayoutRoute title="Subscription Tiers">
            <Plans />
          </LayoutRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <LayoutRoute title="Payment History">
            <History />
          </LayoutRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <LayoutRoute title="Admin user database" adminOnly={true}>
            <UsersList />
          </LayoutRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
